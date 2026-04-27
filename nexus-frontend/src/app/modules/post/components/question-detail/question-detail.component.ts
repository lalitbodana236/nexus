import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { CodeViewerTab } from '../../../../shared/components/code-viewer/code-viewer.component';
import { TOPIC_TRACKS } from '../../config/track.config';
import { Question } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-question-detail',
  standalone: false,
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {
  readonly topicTracks = TOPIC_TRACKS;
  question?: Question;
  prevQuestion?: Question;
  nextQuestion?: Question;
  codeTabs: CodeViewerTab[] = [];
  activeCodeTab?: CodeViewerTab;
  isSidebarCollapsed = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: PracticeStoreService,
    private readonly router: Router,
    private readonly sidebarState: SidebarStateService
  ) {}

  ngOnInit(): void {
    this.sidebarState.initForViewport(window.innerWidth);
    this.sidebarState.collapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

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
      this.codeTabs = (this.question.solutions ?? []).map((solution) => ({
        label: solution.label,
        language: solution.language,
        code: solution.code
      }));
      this.activeCodeTab = this.codeTabs[0];
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

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  onCodeTabChanged(tab: CodeViewerTab): void {
    this.activeCodeTab = tab;
  }

  async copyCode(): Promise<void> {
    const code = this.activeCodeTab?.code ?? this.codeTabs[0]?.code;
    if (code) {
      await navigator.clipboard.writeText(code);
    }
  }

  openExternalPlatform(): void {
    const query = encodeURIComponent(`${this.question?.title ?? 'coding problem'} solution`);
    window.open(`https://leetcode.com/problemset/?search=${query}`, '_blank', 'noopener,noreferrer');
  }
}
