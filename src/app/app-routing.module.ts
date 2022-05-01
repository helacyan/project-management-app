import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './core/pages/error-page/error-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule),
  },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
