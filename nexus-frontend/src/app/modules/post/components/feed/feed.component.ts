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
  trackQuestions: Question[] = [];
  questions: Question[] = [];
  role: UserRole = 'guest';
  visibleCount = 40;
  currentTrack: QuestionTrack = 'coding';
  isSidebarCollapsed = false;
  mode: 'theory' | 'practice' = 'practice';

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

  get conceptTitle(): string {
    if (this.currentTrack === 'coding') {
      return 'Concept First: DSA Patterns';
    }

    if (this.currentTrack === 'system-design') {
      return 'Concept First: System Design Thinking';
    }

    return 'Concept First: Low Level Design';
  }

  get conceptSummary(): string {
    if (this.currentTrack === 'coding') {
      return 'Start with arrays, hashing, two pointers, sliding window, recursion, trees, graphs, dynamic programming, and complexity analysis.';
    }

    if (this.currentTrack === 'system-design') {
      return 'Understand requirements, APIs, data models, capacity estimates, caching, queues, consistency, and failure handling.';
    }

    return 'Learn entities, responsibilities, interfaces, SOLID, design patterns, and how to convert requirements into clean object models.';
  }

  get previewTopic(): string {
    if (this.currentTrack === 'coding') {
      return 'Arrays & Hashing';
    }

    if (this.currentTrack === 'system-design') {
      return 'Requirements and API Design';
    }

    return 'Entities and Responsibilities';
  }

  get conceptPoints(): string[] {
    if (this.currentTrack === 'coding') {
      return ['Arrays & Hashing', 'Two Pointers & Sliding Window', 'Trees, Graphs, Dynamic Programming'];
    }

    if (this.currentTrack === 'system-design') {
      return ['Requirements and APIs', 'Capacity, Data Modeling, Caching', 'Reliability, Scale, and Trade-offs'];
    }

    return ['Entities and Responsibilities', 'Interfaces, SOLID, and Patterns', 'Modeling Real Workflows'];
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isLoggedIn(): boolean {
    return this.role !== 'guest';
  }

  get trackTitle(): string {
    if (this.currentTrack === 'system-design') {
      return 'System Design Practice';
    }

    if (this.currentTrack === 'low-level-design') {
      return 'Low Level Design Practice';
    }

    return 'DSA Practice';
  }

  get trackSubtitle(): string {
    return 'Switch between theory and practice from the left panel.';
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

  setMode(mode: 'theory' | 'practice'): void {
    this.mode = mode;
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
    this.trackQuestions = this.allQuestions.filter((item) => item.track === this.currentTrack);
    this.questions = [...this.trackQuestions];
  }
}
