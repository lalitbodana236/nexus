import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-collapsible-sidebar',
  standalone: false,
  templateUrl: './collapsible-sidebar.component.html',
  styleUrls: ['./collapsible-sidebar.component.scss']
})
export class CollapsibleSidebarComponent {
  @Input() collapsed = false;
  @Input() title = '';

  @Output() toggleClick = new EventEmitter<void>();
}
