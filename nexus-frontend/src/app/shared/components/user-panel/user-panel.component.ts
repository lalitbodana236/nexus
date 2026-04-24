import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  standalone: false,
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent {
  @Input() username = 'Guest User';
  @Input() role = 'guest';
  @Input() collapsed = false;

  @Output() profileClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  get initials(): string {
    return this.username
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}

