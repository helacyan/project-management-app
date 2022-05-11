import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInService } from 'src/app/api/services/auth/sign-in.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(public signinService: SignInService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  form: FormGroup = new FormGroup({});

  submit() {
    if (this.form.valid) {
      this.signinService.signIn({ ...this.form.value }).subscribe(() => {
        return localStorage.getItem('userToken') ? this.router.navigate(['/']) : null;
      });
    }
    return;
  }
}
