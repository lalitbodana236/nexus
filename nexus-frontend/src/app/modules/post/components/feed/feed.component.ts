import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, UserRole } from '../../../../core/services/auth.service';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { DEFAULT_TRACK_ID, TOPIC_TRACKS, getTopicTrackDefinition, getTrackDefinition } from '../../config/track.config';
import { LearningLesson } from '../../models/learning.models';
import { Question, QuestionTrack } from '../../models/practice.models';
import { LearningStoreService } from '../../services/learning-store.service';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-feed',
  standalone: false,
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  readonly topicTracks = TOPIC_TRACKS;
  allQuestions: Question[] = [];
  trackQuestions: Question[] = [];
  questions: Question[] = [];
  learningLessons: LearningLesson[] = [];
  selectedLessonId = '';
  role: UserRole = 'guest';
  visibleCount = 40;
  currentTrack: QuestionTrack = DEFAULT_TRACK_ID;
  isSidebarCollapsed = false;
  mode: 'theory' | 'practice' = 'practice';

  constructor(
    private readonly store: PracticeStoreService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly sidebarState: SidebarStateService,
    private readonly learningStore: LearningStoreService
  ) {}

  ngOnInit(): void {
    this.store.questions$.subscribe((questions) => {
      this.allQuestions = questions;
      this.applyTrackFilter();
    });

    this.route.paramMap.subscribe((params) => {
      const rawTrack = params.get('track');
      const track = getTopicTrackDefinition(rawTrack)?.id ?? DEFAULT_TRACK_ID;

      this.currentTrack = track;
      this.visibleCount = 40;
      this.applyTrackFilter();
    });

    this.route.queryParamMap.subscribe((params) => {
      const mode = params.get('mode');
      const lessonId = params.get('lesson');

      if (mode === 'theory' || mode === 'practice') {
        this.mode = mode;
      }

      this.selectedLessonId = lessonId ?? this.selectedLessonId;
      this.ensureSelectedLesson();
    });

    this.authService.role$.subscribe((role) => {
      this.role = role;
    });

    this.sidebarState.initForViewport(window.innerWidth);
    this.sidebarState.collapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this.learningStore.lessons$.subscribe(() => {
      this.learningLessons = this.learningStore.getLessonsByTrack(this.currentTrack);
      this.ensureSelectedLesson();
    });
  }

  get visibleQuestions(): Question[] {
    return this.questions.slice(0, this.visibleCount);
  }

  get conceptTitle(): string {
    if (this.selectedLesson) {
      return this.selectedLesson.title;
    }

    return this.currentTrackDef?.conceptTitle ?? 'Concept First';
  }

  get conceptSummary(): string {
    if (this.selectedLesson) {
      return this.selectedLesson.summary;
    }

    return this.currentTrackDef?.conceptSummary ?? '';
  }

  get previewTopic(): string {
    if (this.selectedLesson?.tags.length) {
      return this.selectedLesson.tags[0];
    }

    return this.currentTrackDef?.sampleTopic ?? '';
  }

  get conceptPoints(): string[] {
    if (this.selectedLesson) {
      return this.selectedLesson.blocks
        .filter((block) => block.type === 'step' || block.type === 'checklist' || block.type === 'theory')
        .map((block) => block.title)
        .slice(0, 6);
    }

    return this.currentTrackDef?.conceptPoints ?? [];
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isLoggedIn(): boolean {
    return this.role !== 'guest';
  }

  get trackTitle(): string {
    return `${this.currentTrackDef?.label ?? 'Track'} Practice`;
  }

  get trackSubtitle(): string {
    return 'Switch between Learn and Practice from the header. Learning topics are managed from Learning Studio.';
  }

  get selectedLesson(): LearningLesson | undefined {
    return this.learningLessons.find((lesson) => lesson.id === this.selectedLessonId);
  }

  get currentTrackDef() {
    return getTrackDefinition(this.currentTrack);
  }

  openSolution(questionId: string): void {
    this.router.navigate(['/feed/solutions', questionId]);
  }

  openTrack(track: QuestionTrack): void {
    this.router.navigate(['/feed/track', track]);
  }

  goToCreate(): void {
    this.router.navigate(['/feed/questions/new']);
  }

  goToMenuConfig(): void {
    this.router.navigate(['/feed/admin/menu']);
  }

  goToLearningStudio(): void {
    this.router.navigate(['/feed/learning/new']);
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode },
      queryParamsHandling: 'merge'
    });
  }

  selectLesson(lessonId: string): void {
    this.selectedLessonId = lessonId;
    this.mode = 'theory';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { lesson: lessonId, mode: 'theory' },
      queryParamsHandling: 'merge'
    });
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
    this.learningLessons = this.learningStore.getLessonsByTrack(this.currentTrack);
    this.ensureSelectedLesson();
  }

  private ensureSelectedLesson(): void {
    if (this.learningLessons.length === 0) {
      this.selectedLessonId = '';
      return;
    }

    const hasSelected = this.learningLessons.some((lesson) => lesson.id === this.selectedLessonId);
    if (!hasSelected) {
      this.selectedLessonId = this.learningLessons[0].id;
    }
  }
}
