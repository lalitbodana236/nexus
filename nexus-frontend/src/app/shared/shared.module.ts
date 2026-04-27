import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarItemComponent } from './components/sidebar-item/sidebar-item.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { CodeViewerComponent } from './components/code-viewer/code-viewer.component';
import { BadgeComponent } from './components/badge/badge.component';
import { TableComponent } from './components/table/table.component';
import { CollapsibleSidebarComponent } from './components/collapsible-sidebar/collapsible-sidebar.component';
import { FormsModule } from '@angular/forms';
import { InteractionThreadComponent } from './components/interaction-thread/interaction-thread.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@NgModule({
  declarations: [
    SidebarItemComponent,
    UserPanelComponent,
    CodeViewerComponent,
    BadgeComponent,
    TableComponent,
    CollapsibleSidebarComponent,
    InteractionThreadComponent,
    ThemeToggleComponent
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    CommonModule,
    FormsModule,
    SidebarItemComponent,
    UserPanelComponent,
    CodeViewerComponent,
    BadgeComponent,
    TableComponent,
    CollapsibleSidebarComponent,
    InteractionThreadComponent,
    ThemeToggleComponent
  ]
})
export class SharedModule {}
