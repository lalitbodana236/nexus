import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PRACTICE_MENU_SEED, QUESTION_SEED } from '../config/practice.seed';
import {
  CreateQuestionPayload,
  PracticeMenuItem,
  PracticeMenuSection,
  Question,
  QuestionTrack
} from '../models/practice.models';

@Injectable({
  providedIn: 'root'
})
export class PracticeStoreService {
  private readonly menuSubject = new BehaviorSubject<PracticeMenuSection[]>(
    JSON.parse(JSON.stringify(PRACTICE_MENU_SEED))
  );
  private readonly questionSubject = new BehaviorSubject<Question[]>(JSON.parse(JSON.stringify(QUESTION_SEED)));

  readonly menu$ = this.menuSubject.asObservable();
  readonly questions$ = this.questionSubject.asObservable();

  getMenuSnapshot(): PracticeMenuSection[] {
    return this.menuSubject.value;
  }

  getQuestionSnapshot(): Question[] {
    return this.questionSubject.value;
  }

  getQuestionById(id: string): Question | undefined {
    return this.questionSubject.value.find((item) => item.id === id);
  }

  getQuestionsByTrack(track: QuestionTrack): Question[] {
    return this.questionSubject.value.filter((item) => item.track === track);
  }

  addQuestion(payload: CreateQuestionPayload): Question {
    const now = new Date().toISOString();
    const id = `q-${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;

    const next: Question = {
      id,
      title: payload.title,
      track: payload.track,
      difficulty: payload.difficulty,
      status: 'Todo',
      favorite: false,
      concept: payload.concept,
      examples: payload.examples,
      prompt: payload.prompt,
      explanation: payload.explanation,
      solutions: payload.solutions,
      tags: payload.tags,
      createdAt: now
    };

    this.questionSubject.next([next, ...this.questionSubject.value]);
    return next;
  }

  setQuestionCompleted(questionId: string, completed: boolean): void {
    const next: Question[] = this.questionSubject.value.map((question) => {
      if (question.id !== questionId) {
        return question;
      }

      return {
        ...question,
        status: completed ? 'Done' : 'Todo'
      };
    });

    this.questionSubject.next(next);
  }

  addMenuItem(sectionId: string, item: Omit<PracticeMenuItem, 'id'>): void {
    const next = this.menuSubject.value.map((section) => {
      if (section.id !== sectionId) {
        return section;
      }

      return {
        ...section,
        items: [
          ...section.items,
          {
            ...item,
            id: `${sectionId}-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
          }
        ]
      };
    });

    this.menuSubject.next(next);
  }
}
