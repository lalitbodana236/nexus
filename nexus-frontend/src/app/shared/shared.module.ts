import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarItemComponent } from './components/sidebar-item/sidebar-item.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';

@NgModule({
  declarations: [SidebarItemComponent, UserPanelComponent],
  imports: [CommonModule],
  exports: [CommonModule, SidebarItemComponent, UserPanelComponent]
})
export class SharedModule {}
