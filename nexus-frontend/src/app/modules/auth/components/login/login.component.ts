import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  loginAsUser(): void {
    this.authService.loginAsUser();
    this.redirectAfterLogin();
  }

  loginAsAdmin(): void {
    this.authService.loginAsAdmin();
    this.redirectAfterLogin();
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/feed';
    this.router.navigateByUrl(returnUrl);
  }
}
