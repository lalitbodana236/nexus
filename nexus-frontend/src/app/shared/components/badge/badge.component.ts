import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: false,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() label = '';
  @Input() tone: 'easy' | 'medium' | 'hard' | 'neutral' = 'neutral';
}
