import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../../core/guards/admin.guard';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FeedComponent } from './components/feed/feed.component';
import { LearningStudioComponent } from './components/learning-studio/learning-studio.component';
import { MenuConfigComponent } from './components/menu-config/menu-config.component';
import { QuestionCreateComponent } from './components/question-create/question-create.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';

const routes: Routes = [
  { path: 'feed', component: FeedComponent },
  { path: 'feed/track/:track', component: FeedComponent },
  { path: 'feed/questions/new', component: QuestionCreateComponent, canActivate: [AdminGuard] },
  { path: 'feed/learning/new', component: LearningStudioComponent, canActivate: [AdminGuard] },
  { path: 'feed/admin/menu', component: MenuConfigComponent, canActivate: [AdminGuard] },
  { path: 'feed/solutions/:id', component: QuestionDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule {}
