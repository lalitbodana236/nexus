import { Component } from '@angular/core';

import { environment } from '../../../environments/environment';
import { NavLink } from '../../shared/models/nav-link.model';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  readonly navLinks: NavLink[] = [
    { label: 'Home', path: '/feed' },
    { label: 'Feed', path: '/feed' },
    { label: 'Profile', path: '/profile' },
    { label: 'Login', href: environment.auth.backendLoginUrl }
  ];
}
