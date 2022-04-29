import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SignInService } from 'src/app/api/auth/sign-in.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(public signinService: SignInService, private http: HttpClient) {}
}
