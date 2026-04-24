import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'guest' | 'user' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'nexus_auth_role';
  private readonly roleSubject = new BehaviorSubject<UserRole>(this.readInitialRole());

  readonly role$ = this.roleSubject.asObservable();

  isAuthenticated(): boolean {
    return this.roleSubject.value !== 'guest';
  }

  isAdmin(): boolean {
    return this.roleSubject.value === 'admin';
  }

  getRole(): UserRole {
    return this.roleSubject.value;
  }

  loginAsUser(): void {
    this.updateRole('user');
  }

  loginAsAdmin(): void {
    this.updateRole('admin');
  }

  logout(): void {
    this.updateRole('guest');
  }

  private updateRole(role: UserRole): void {
    this.roleSubject.next(role);
    try {
      localStorage.setItem(this.storageKey, role);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }

  private readInitialRole(): UserRole {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored === 'user' || stored === 'admin') {
        return stored;
      }
    } catch {
      // Ignore storage failures in restricted environments.
    }

    return 'guest';
  }
}
