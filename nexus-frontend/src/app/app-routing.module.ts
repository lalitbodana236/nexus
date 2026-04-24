import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'feed' },
  {
    path: '',
    loadChildren: () => import('./modules/post/post.module').then((m) => m.PostModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/user/user.module').then((m) => m.UserModule)
  },
  {
    path: '',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  { path: '**', redirectTo: 'feed' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}