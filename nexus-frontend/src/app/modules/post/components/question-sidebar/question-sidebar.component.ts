import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';
import { UserStateService } from '../../../../core/services/user-state.service';
import { BACKEND_ROADMAP_TRACKS, DEFAULT_TRACK_ID, TOPIC_TRACKS } from '../../config/track.config';
import { LearningLesson } from '../../models/learning.models';
import { Question } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-question-sidebar',
  standalone: false,
  templateUrl: './question-sidebar.component.html',
  styleUrls: ['./question-sidebar.component.scss']
})
export class QuestionSidebarComponent implements OnInit {
  readonly topicTracks = TOPIC_TRACKS;
  readonly backendTracks = BACKEND_ROADMAP_TRACKS;
  @Input() showQuestionList = false;
  @Input() currentTrack: Question['track'] = DEFAULT_TRACK_ID;
  @Input() mode: 'theory' | 'practice' = 'practice';
  @Input() learningLessons: LearningLesson[] = [];
  @Input() selectedLessonId = '';
  @Output() modeChange = new EventEmitter<'theory' | 'practice'>();
  @Output() lessonChange = new EventEmitter<string>();

  isCollapsed = false;
  questions: Question[] = [];
  visibleCount = 80;
  username = 'Guest User';
  roleLabel = 'guest';

  constructor(
    private readonly store: PracticeStoreService,
    private readonly router: Router,
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
      this.questions = [...questions].sort((a, b) => {
        const trackA = this.topicTracks.findIndex((track) => track.id === a.track);
        const trackB = this.topicTracks.findIndex((track) => track.id === b.track);
        const orderA = trackA < 0 ? this.topicTracks.length + 1 : trackA;
        const orderB = trackB < 0 ? this.topicTracks.length + 1 : trackB;
        const trackDiff = orderA - orderB;
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

  openQuestion(questionId: string): void {
    this.router.navigate(['/feed/solutions', questionId]);
  }

  openTrack(track: Question['track']): void {
    this.router.navigate(['/feed/track', track]);
  }

  setMode(mode: 'theory' | 'practice'): void {
    this.modeChange.emit(mode);
  }

  selectLesson(lessonId: string): void {
    this.lessonChange.emit(lessonId);
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
    this.router.navigate(['/feed/track', DEFAULT_TRACK_ID]);
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
