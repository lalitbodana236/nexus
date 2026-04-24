import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Question } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-question-detail',
  standalone: false,
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {
  question?: Question;
  prevQuestion?: Question;
  nextQuestion?: Question;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: PracticeStoreService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.router.navigate(['/feed']);
        return;
      }

      const questions = this.store.getQuestionSnapshot();
      const currentIndex = questions.findIndex((item) => item.id === id);

      if (currentIndex < 0) {
        this.router.navigate(['/feed']);
        return;
      }

      this.question = questions[currentIndex];
      this.prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : undefined;
      this.nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : undefined;
    });
  }

  goPrev(): void {
    if (this.prevQuestion) {
      this.router.navigate(['/feed/solutions', this.prevQuestion.id]);
    }
  }

  goNext(): void {
    if (this.nextQuestion) {
      this.router.navigate(['/feed/solutions', this.nextQuestion.id]);
    }
  }
}
