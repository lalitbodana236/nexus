import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, UserRole } from '../../../../core/services/auth.service';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { Question, QuestionTrack } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-feed',
  standalone: false,
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  allQuestions: Question[] = [];
  questions: Question[] = [];
  role: UserRole = 'guest';
  visibleCount = 40;
  currentTrack: QuestionTrack = 'coding';
  isSidebarCollapsed = false;
  readonly monthDays = Array.from({ length: 30 }, (_, index) => index + 1);

  constructor(
    private readonly store: PracticeStoreService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly sidebarState: SidebarStateService
  ) {}

  ngOnInit(): void {
    this.store.questions$.subscribe((questions) => {
      this.allQuestions = questions;
      this.applyTrackFilter();
    });

    this.route.paramMap.subscribe((params) => {
      const rawTrack = params.get('track');
      const track: QuestionTrack =
        rawTrack === 'system-design' || rawTrack === 'low-level-design' || rawTrack === 'coding'
          ? rawTrack
          : 'coding';

      this.currentTrack = track;
      this.visibleCount = 40;
      this.applyTrackFilter();
    });

    this.authService.role$.subscribe((role) => {
      this.role = role;
    });

    this.sidebarState.initForViewport(window.innerWidth);
    this.sidebarState.collapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
  }

  get visibleQuestions(): Question[] {
    return this.questions.slice(0, this.visibleCount);
  }

  get completedCount(): number {
    return this.questions.filter((item) => item.status === 'Done').length;
  }

  get easyCount(): number {
    return this.questions.filter((item) => item.difficulty === 'Easy').length;
  }

  get mediumCount(): number {
    return this.questions.filter((item) => item.difficulty === 'Medium').length;
  }

  get hardCount(): number {
    return this.questions.filter((item) => item.difficulty === 'Hard').length;
  }

  get completionPercent(): number {
    if (this.questions.length === 0) {
      return 0;
    }

    return Math.round((this.completedCount / this.questions.length) * 100);
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isLoggedIn(): boolean {
    return this.role !== 'guest';
  }

  get trackTitle(): string {
    if (this.currentTrack === 'system-design') {
      return 'System Design Questions';
    }

    if (this.currentTrack === 'low-level-design') {
      return 'Low Level Design Questions';
    }

    return 'Top 250 Most Asked Coding Questions';
  }

  get trackSubtitle(): string {
    if (this.currentTrack === 'coding') {
      return 'Everyone can browse the full list. Solutions are available only after login. Admins can curate questions and menu.';
    }

    return 'This track is public to browse. Open any item to view solution details (login required).';
  }

  openSolution(questionId: string): void {
    this.router.navigate(['/feed/solutions', questionId]);
  }

  openSystemDesign(): void {
    this.router.navigate(['/feed/track/system-design']);
  }

  openLowLevelDesign(): void {
    this.router.navigate(['/feed/track/low-level-design']);
  }

  openCoding(): void {
    this.router.navigate(['/feed/track/coding']);
  }

  goToCreate(): void {
    this.router.navigate(['/feed/questions/new']);
  }

  goToMenuConfig(): void {
    this.router.navigate(['/feed/admin/menu']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/feed']);
  }

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  toggleCompleted(event: Event, question: Question): void {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    this.store.setQuestionCompleted(question.id, target.checked);
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 120;

    if (nearBottom && this.visibleCount < this.questions.length) {
      this.visibleCount += 40;
    }
  }

  trackByQuestionId(_: number, question: Question): string {
    return question.id;
  }

  private applyTrackFilter(): void {
    this.questions = this.allQuestions.filter((item) => item.track === this.currentTrack);
  }
}
