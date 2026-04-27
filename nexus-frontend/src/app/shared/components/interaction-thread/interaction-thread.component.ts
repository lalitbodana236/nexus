import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { EngagementComment, EngagementService, EngagementThread } from '../../../core/services/engagement.service';

@Component({
  selector: 'app-interaction-thread',
  standalone: false,
  templateUrl: './interaction-thread.component.html',
  styleUrls: ['./interaction-thread.component.scss']
})
export class InteractionThreadComponent implements OnInit, OnDestroy {
  @Input() targetType = 'content';
  @Input() targetId = '';
  @Input() compact = false;

  thread: EngagementThread = {
    likes: 0,
    dislikes: 0,
    userReaction: null,
    comments: []
  };
  draft = '';
  replyDrafts: Record<string, string> = {};
  replyOpen: Record<string, boolean> = {};

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly engagement: EngagementService) {}

  ngOnInit(): void {
    this.engagement
      .getThread(this.key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((thread) => {
        this.thread = thread;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get key(): string {
    return `${this.targetType}:${this.targetId}`;
  }

  toggleThreadReaction(reaction: 'like' | 'dislike'): void {
    this.engagement.toggleThreadReaction(this.key, reaction);
  }

  addRootComment(): void {
    if (!this.draft.trim()) {
      return;
    }

    this.engagement.addComment(this.key, this.draft, null);
    this.draft = '';
  }

  toggleReply(commentId: string): void {
    this.replyOpen[commentId] = !this.replyOpen[commentId];
    if (!this.replyOpen[commentId]) {
      this.replyDrafts[commentId] = '';
    }
  }

  addReply(commentId: string): void {
    const draft = this.replyDrafts[commentId] ?? '';
    if (!draft.trim()) {
      return;
    }

    this.engagement.addComment(this.key, draft, commentId);
    this.replyDrafts[commentId] = '';
    this.replyOpen[commentId] = false;
  }

  reactComment(commentId: string, reaction: 'like' | 'dislike'): void {
    this.engagement.toggleCommentReaction(this.key, commentId, reaction);
  }

  formatTimestamp(timestamp: string): string {
    const ms = Date.now() - new Date(timestamp).getTime();
    if (ms < 60_000) {
      return 'just now';
    }
    if (ms < 3_600_000) {
      return `${Math.floor(ms / 60_000)}m ago`;
    }
    if (ms < 86_400_000) {
      return `${Math.floor(ms / 3_600_000)}h ago`;
    }
    return `${Math.floor(ms / 86_400_000)}d ago`;
  }

  trackByComment(_: number, comment: EngagementComment): string {
    return comment.id;
  }
}
