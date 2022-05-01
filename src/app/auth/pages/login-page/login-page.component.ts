import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SignInService } from 'src/app/api/services/auth/sign-in.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  constructor(public signinService: SignInService, private http: HttpClient) {}
}
