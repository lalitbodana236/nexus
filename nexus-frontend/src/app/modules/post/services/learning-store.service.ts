import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LEARNING_SEED } from '../config/learning.seed';
import { CreateLearningLessonPayload, LearningLesson } from '../models/learning.models';
import { QuestionTrack } from '../models/practice.models';

@Injectable({
  providedIn: 'root'
})
export class LearningStoreService {
  private readonly lessonSubject = new BehaviorSubject<LearningLesson[]>(JSON.parse(JSON.stringify(LEARNING_SEED)));
  readonly lessons$ = this.lessonSubject.asObservable();

  getLessonSnapshot(): LearningLesson[] {
    return this.lessonSubject.value;
  }

  getLessonsByTrack(track: QuestionTrack): LearningLesson[] {
    return this.lessonSubject.value
      .filter((lesson) => lesson.track === track)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }

  addLesson(payload: CreateLearningLessonPayload): LearningLesson {
    const now = Date.now();
    const existingByTrack = this.getLessonsByTrack(payload.track);

    const nextLesson: LearningLesson = {
      id: `lesson-${payload.track}-${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${now}`,
      track: payload.track,
      title: payload.title,
      summary: payload.summary,
      order: existingByTrack.length + 1,
      tags: payload.tags,
      blocks: payload.blocks.map((block, index) => ({
        ...block,
        id: block.id || `block-${index + 1}-${now}`
      }))
    };

    this.lessonSubject.next([nextLesson, ...this.lessonSubject.value]);
    return nextLesson;
  }
}
