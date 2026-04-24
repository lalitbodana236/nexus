import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarItemComponent } from './components/sidebar-item/sidebar-item.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { CodeViewerComponent } from './components/code-viewer/code-viewer.component';
import { BadgeComponent } from './components/badge/badge.component';
import { TableComponent } from './components/table/table.component';
import { CollapsibleSidebarComponent } from './components/collapsible-sidebar/collapsible-sidebar.component';

@NgModule({
  declarations: [
    SidebarItemComponent,
    UserPanelComponent,
    CodeViewerComponent,
    BadgeComponent,
    TableComponent,
    CollapsibleSidebarComponent
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    SidebarItemComponent,
    UserPanelComponent,
    CodeViewerComponent,
    BadgeComponent,
    TableComponent,
    CollapsibleSidebarComponent
  ]
})
export class SharedModule {}
