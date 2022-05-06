import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/guards/auth-guard.service';
import { ErrorPageComponent } from './core/pages/error-page/error-page.component';
import { WelcomePageComponent } from './core/pages/welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule),
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'welcome',
    component: WelcomePageComponent,
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    canActivate: [AuthGuardService],
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
