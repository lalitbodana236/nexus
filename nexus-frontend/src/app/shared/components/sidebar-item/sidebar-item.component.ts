import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-item',
  standalone: false,
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss']
})
export class SidebarItemComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() collapsed = false;

  @Output() itemClick = new EventEmitter<void>();
}

