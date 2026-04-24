import { Injectable } from '@angular/core';

import { AuthService, UserRole } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  constructor(private readonly authService: AuthService) {}

  get username(): string {
    const role = this.authService.getRole();
    if (role === 'admin') {
      return 'Platform Admin';
    }

    if (role === 'user') {
      return 'Developer User';
    }

    return 'Guest User';
  }

  get role(): UserRole {
    return this.authService.getRole();
  }
}

