import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { PostRoutingModule } from './post-routing.module';
import { FeedComponent } from './components/feed/feed.component';
import { QuestionSidebarComponent } from './components/question-sidebar/question-sidebar.component';
import { QuestionCreateComponent } from './components/question-create/question-create.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { MenuConfigComponent } from './components/menu-config/menu-config.component';

@NgModule({
  declarations: [
    FeedComponent,
    QuestionCreateComponent,
    QuestionDetailComponent,
    MenuConfigComponent,
    QuestionSidebarComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, PostRoutingModule]
})
export class PostModule {}
