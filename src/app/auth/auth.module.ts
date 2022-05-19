import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import SharedModule from '../shared/shared.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { LoginGuardService } from './guards/login-guard.service';

@NgModule({
  declarations: [LoginPageComponent, SignupPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [LoginGuardService],
      },
      {
        path: 'signup',
        component: SignupPageComponent,
        canActivate: [LoginGuardService],
      },
    ]),
  ],
  providers: [LoginGuardService],
})
export class AuthModule {}
