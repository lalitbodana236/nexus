import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  private readonly storageKey = 'nexus_sidebar_collapsed';
  private readonly collapsedSubject = new BehaviorSubject<boolean>(this.readInitial());

  readonly collapsed$ = this.collapsedSubject.asObservable();

  get isCollapsed(): boolean {
    return this.collapsedSubject.value;
  }

  toggle(): void {
    this.setCollapsed(!this.collapsedSubject.value);
  }

  setCollapsed(collapsed: boolean): void {
    this.collapsedSubject.next(collapsed);
    this.write(collapsed);
  }

  initForViewport(viewportWidth: number): void {
    if (viewportWidth < 992) {
      this.setCollapsed(true);
    }
  }

  private readInitial(): boolean {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw === 'true' || raw === 'false') {
        return raw === 'true';
      }
    } catch {
      // Ignore storage failures.
    }

    return false;
  }

  private write(value: boolean): void {
    try {
      localStorage.setItem(this.storageKey, String(value));
    } catch {
      // Ignore storage failures.
    }
  }
}

