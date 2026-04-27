import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DEFAULT_TRACK_ID, TOPIC_TRACKS } from '../../config/track.config';
import { Difficulty, QuestionSolution, QuestionTrack } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-question-create',
  standalone: false,
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent {
  readonly trackOptions = TOPIC_TRACKS;
  readonly difficultyOptions: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  readonly languageOptions: QuestionSolution['language'][] = ['java', 'python', 'javascript'];

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: PracticeStoreService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      track: [DEFAULT_TRACK_ID as QuestionTrack, [Validators.required]],
      difficulty: ['Easy' as Difficulty, [Validators.required]],
      concept: ['', [Validators.required, Validators.minLength(10)]],
      examples: this.fb.array([this.exampleGroup()]),
      prompt: ['', [Validators.required, Validators.minLength(10)]],
      explanation: ['', [Validators.required, Validators.minLength(10)]],
      solutions: this.fb.array([this.solutionGroup()]),
      tags: ['Array, Hashing']
    });
  }

  get examples(): FormArray {
    return this.form.controls.examples;
  }

  get solutions(): FormArray {
    return this.form.controls.solutions;
  }

  addExample(): void {
    this.examples.push(this.exampleGroup());
  }

  removeExample(index: number): void {
    if (this.examples.length > 1) {
      this.examples.removeAt(index);
    }
  }

  addSolution(): void {
    this.solutions.push(this.solutionGroup());
  }

  removeSolution(index: number): void {
    if (this.solutions.length > 1) {
      this.solutions.removeAt(index);
    }
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
      concept: values.concept,
      examples: values.examples
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
      prompt: values.prompt,
      explanation: values.explanation,
      solutions: values.solutions
        .map((solution) => ({
          label: solution.label.trim(),
          language: solution.language,
          code: solution.code.trim()
        }))
        .filter((solution) => solution.label.length > 0 && solution.code.length > 0),
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    });

    this.router.navigate(['/feed/solutions', question.id]);
  }

  private exampleGroup() {
    return this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]);
  }

  private solutionGroup() {
    return this.fb.nonNullable.group({
      label: ['Java', [Validators.required, Validators.minLength(2)]],
      language: ['java' as QuestionSolution['language'], [Validators.required]],
      code: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
}
