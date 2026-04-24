import { Location } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { UserStateService } from '../../../../core/services/user-state.service';
import { Question } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-question-sidebar',
  standalone: false,
  templateUrl: './question-sidebar.component.html',
  styleUrls: ['./question-sidebar.component.scss']
})
export class QuestionSidebarComponent implements OnInit {
  @Input() showQuestionList = false;

  isCollapsed = false;
  questions: Question[] = [];
  visibleCount = 80;
  username = 'Guest User';
  roleLabel = 'guest';

  constructor(
    private readonly store: PracticeStoreService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly sidebarState: SidebarStateService,
    private readonly userState: UserStateService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sidebarState.initForViewport(window.innerWidth);
    this.sidebarState.collapsed$.subscribe((collapsed) => {
      this.isCollapsed = collapsed;
    });

    this.store.questions$.subscribe((questions) => {
      const order: Record<Question['track'], number> = {
        coding: 0,
        'system-design': 1,
        'low-level-design': 2
      };

      this.questions = [...questions].sort((a, b) => {
        const trackDiff = order[a.track] - order[b.track];
        if (trackDiff !== 0) {
          return trackDiff;
        }

        return a.id.localeCompare(b.id);
      });
    });

    this.authService.role$.subscribe(() => {
      this.username = this.userState.username;
      this.roleLabel = this.userState.role;
    });
  }

  get visibleQuestions(): Question[] {
    return this.questions.slice(0, this.visibleCount);
  }

  toggle(): void {
    this.sidebarState.toggle();
  }

  goBack(): void {
    this.location.back();
  }

  openQuestion(questionId: string): void {
    this.router.navigate(['/feed/solutions', questionId]);
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;

    if (nearBottom && this.visibleCount < this.questions.length) {
      this.visibleCount += 50;
    }
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  openSettings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/feed/track/coding']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const target = event.target as Window;
    this.sidebarState.initForViewport(target.innerWidth);
  }

  trackByQuestionId(_: number, question: Question): string {
    return question.id;
  }
}
