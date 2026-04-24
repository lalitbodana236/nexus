import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Difficulty, QuestionTrack } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-question-create',
  standalone: false,
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent {
  readonly difficultyOptions: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  readonly trackOptions: QuestionTrack[] = ['coding', 'system-design', 'low-level-design'];

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: PracticeStoreService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      track: ['coding' as QuestionTrack, [Validators.required]],
      difficulty: ['Easy' as Difficulty, [Validators.required]],
      prompt: ['', [Validators.required, Validators.minLength(10)]],
      explanation: ['', [Validators.required, Validators.minLength(10)]],
      tags: ['Array, Hashing']
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const question = this.store.addQuestion({
      title: values.title,
      track: values.track,
      difficulty: values.difficulty,
      prompt: values.prompt,
      explanation: values.explanation,
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    });

    this.router.navigate(['/feed/solutions', question.id]);
  }
}
