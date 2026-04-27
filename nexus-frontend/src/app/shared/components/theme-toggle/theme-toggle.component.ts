import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AppTheme, ThemeService } from '../../../core/services/theme.service';
import { ThemeDefinition } from '../../../core/theme/app-themes';

@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: AppTheme = 'dark';
  currentMeta: ThemeDefinition;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly themeService: ThemeService) {
    this.currentMeta = this.themeService.currentThemeMeta;
  }

  ngOnInit(): void {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.currentTheme = theme;
        this.currentMeta = this.themeService.getThemeMeta(theme);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get ariaLabel(): string {
    return `Switch theme. Current ${this.currentMeta?.label ?? 'Dark'}`;
  }
}
