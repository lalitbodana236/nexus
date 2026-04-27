import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

type ReactionType = 'like' | 'dislike' | null;

export interface EngagementComment {
  id: string;
  parentId: string | null;
  text: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  userReaction: ReactionType;
  replies: EngagementComment[];
}

export interface EngagementThread {
  likes: number;
  dislikes: number;
  userReaction: ReactionType;
  comments: EngagementComment[];
}

@Injectable({
  providedIn: 'root'
})
export class EngagementService {
  private readonly storageKey = 'nexus.engagement.v3';
  private readonly stateSubject = new BehaviorSubject<Record<string, EngagementThread>>({});
  private commentCounter = 0;

  constructor() {
    this.hydrate();
  }

  getThread(targetKey: string): Observable<EngagementThread> {
    return this.stateSubject.asObservable().pipe(map((state) => state[targetKey] ?? this.emptyThread()));
  }

  toggleThreadReaction(targetKey: string, reaction: Exclude<ReactionType, null>): void {
    const current = this.currentThread(targetKey);
    const nextReaction: ReactionType = current.userReaction === reaction ? null : reaction;
    const next = {
      ...current,
      ...this.applyReactionCounts(current.likes, current.dislikes, current.userReaction, nextReaction),
      userReaction: nextReaction
    };

    this.updateThread(targetKey, next);
  }

  addComment(targetKey: string, text: string, parentId: string | null = null): void {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const current = this.currentThread(targetKey);
    const comment: EngagementComment = {
      id: `comment-${Date.now()}-${++this.commentCounter}`,
      parentId,
      text: trimmed,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      userReaction: null,
      replies: []
    };

    const nextComments =
      parentId === null ? [comment, ...current.comments] : this.insertReply(current.comments, parentId, comment);

    this.updateThread(targetKey, {
      ...current,
      comments: nextComments
    });
  }

  toggleCommentReaction(targetKey: string, commentId: string, reaction: Exclude<ReactionType, null>): void {
    const current = this.currentThread(targetKey);
    const nextComments = this.updateCommentTree(current.comments, commentId, (comment) => {
      const nextReaction: ReactionType = comment.userReaction === reaction ? null : reaction;
      const counts = this.applyReactionCounts(comment.likes, comment.dislikes, comment.userReaction, nextReaction);

      return {
        ...comment,
        ...counts,
        userReaction: nextReaction
      };
    });

    this.updateThread(targetKey, {
      ...current,
      comments: nextComments
    });
  }

  private emptyThread(): EngagementThread {
    return {
      likes: 0,
      dislikes: 0,
      userReaction: null,
      comments: []
    };
  }

  private currentThread(targetKey: string): EngagementThread {
    return this.stateSubject.value[targetKey] ?? this.emptyThread();
  }

  private updateThread(targetKey: string, thread: EngagementThread): void {
    const nextState = {
      ...this.stateSubject.value,
      [targetKey]: thread
    };
    this.stateSubject.next(nextState);
    this.persist(nextState);
  }

  private applyReactionCounts(
    likes: number,
    dislikes: number,
    current: ReactionType,
    next: ReactionType
  ): { likes: number; dislikes: number } {
    let nextLikes = likes;
    let nextDislikes = dislikes;

    if (current === 'like') {
      nextLikes = Math.max(0, nextLikes - 1);
    } else if (current === 'dislike') {
      nextDislikes = Math.max(0, nextDislikes - 1);
    }

    if (next === 'like') {
      nextLikes += 1;
    } else if (next === 'dislike') {
      nextDislikes += 1;
    }

    return { likes: nextLikes, dislikes: nextDislikes };
  }

  private insertReply(
    comments: EngagementComment[],
    parentId: string,
    reply: EngagementComment
  ): EngagementComment[] {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [reply, ...comment.replies]
        };
      }

      if (comment.replies.length === 0) {
        return comment;
      }

      return {
        ...comment,
        replies: this.insertReply(comment.replies, parentId, reply)
      };
    });
  }

  private updateCommentTree(
    comments: EngagementComment[],
    commentId: string,
    updater: (comment: EngagementComment) => EngagementComment
  ): EngagementComment[] {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return updater(comment);
      }

      if (comment.replies.length === 0) {
        return comment;
      }

      return {
        ...comment,
        replies: this.updateCommentTree(comment.replies, commentId, updater)
      };
    });
  }

  private hydrate(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as Record<string, EngagementThread>;
      if (parsed && typeof parsed === 'object') {
        this.stateSubject.next(parsed);
      }
    } catch {
      this.stateSubject.next({});
    }
  }

  private persist(state: Record<string, EngagementThread>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch {
      // Ignore storage failures to keep UI responsive.
    }
  }
}
