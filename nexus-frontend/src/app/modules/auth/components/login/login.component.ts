import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    window.location.replace(this.authService.backendLoginUrl);
  }
}
