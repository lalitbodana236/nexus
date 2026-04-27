import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DEFAULT_TRACK_ID, TOPIC_TRACKS } from '../../config/track.config';
import { CreateLearningLessonPayload, LearningBlockType } from '../../models/learning.models';
import { QuestionTrack } from '../../models/practice.models';
import { LearningStoreService } from '../../services/learning-store.service';

@Component({
  selector: 'app-learning-studio',
  standalone: false,
  templateUrl: './learning-studio.component.html',
  styleUrls: ['./learning-studio.component.scss']
})
export class LearningStudioComponent {
  readonly trackOptions = TOPIC_TRACKS;
  readonly blockTypes: LearningBlockType[] = [
    'theory',
    'step',
    'example',
    'code',
    'checklist',
    'class-diagram',
    'component-diagram',
    'note',
    'image'
  ];

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly learningStore: LearningStoreService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      track: [DEFAULT_TRACK_ID as QuestionTrack, [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(4)]],
      summary: ['', [Validators.required, Validators.minLength(10)]],
      tags: ['Foundations, FAANG'],
      blocks: this.fb.array([this.blockGroup('theory')])
    });
  }

  get blocks(): FormArray {
    return this.form.controls.blocks;
  }

  addBlock(type: LearningBlockType = 'theory'): void {
    this.blocks.push(this.blockGroup(type));
  }

  removeBlock(index: number): void {
    if (this.blocks.length > 1) {
      this.blocks.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const payload: CreateLearningLessonPayload = {
      track: values.track,
      title: values.title.trim(),
      summary: values.summary.trim(),
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      blocks: values.blocks.map((block, index) => ({
        id: `block-${index + 1}`,
        type: block.type,
        title: block.title.trim(),
        content: block.content.trim() || undefined,
        language: block.language as 'java' | 'python' | 'javascript' | 'text',
        code: block.code.trim() || undefined,
        imageUrl: block.imageUrl.trim() || undefined,
        items: block.items
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      }))
    };

    const lesson = this.learningStore.addLesson(payload);
    this.router.navigate(['/feed/track', lesson.track], { queryParams: { mode: 'theory', lesson: lesson.id } });
  }

  private blockGroup(type: LearningBlockType) {
    return this.fb.nonNullable.group({
      type: [type, [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(2)]],
      content: [''],
      language: ['text'],
      code: [''],
      items: [''],
      imageUrl: ['']
    });
  }
}
