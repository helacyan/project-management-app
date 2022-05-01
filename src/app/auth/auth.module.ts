import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import SharedModule from '../shared/shared.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginPageComponent,
      },
    ]),
  ],
})
export class AuthModule {}
