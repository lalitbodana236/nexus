import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_THEMES, AppTheme, ThemeDefinition } from '../theme/app-themes';
export type { AppTheme };

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'nexus.theme.v1';
  private readonly themeSubject = new BehaviorSubject<AppTheme>('dark');

  readonly theme$ = this.themeSubject.asObservable();

  init(): void {
    const saved = this.readStoredTheme();
    const initialTheme = saved ?? 'dark';
    this.applyTheme(initialTheme);
  }

  toggleTheme(): void {
    const next: AppTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }

  setTheme(theme: AppTheme): void {
    this.applyTheme(theme);
  }

  get currentTheme(): AppTheme {
    return this.themeSubject.value;
  }

  get currentThemeMeta(): ThemeDefinition {
    return APP_THEMES[this.themeSubject.value];
  }

  getThemeMeta(theme: AppTheme): ThemeDefinition {
    return APP_THEMES[theme];
  }

  private applyTheme(theme: AppTheme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);

    const body = document.body;
    for (const key of Object.keys(APP_THEMES) as AppTheme[]) {
      body.classList.remove(APP_THEMES[key].bodyClass);
    }
    body.classList.add(APP_THEMES[theme].bodyClass);
  }

  private readStoredTheme(): AppTheme | null {
    const value = localStorage.getItem(this.storageKey);
    return value === 'dark' || value === 'light' ? value : null;
  }
}
