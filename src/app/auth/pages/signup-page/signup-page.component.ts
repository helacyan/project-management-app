import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { SignInService } from 'src/app/api/services/auth/sign-in.service';
import { ToastService } from 'src/app/api/services/auth/toast.service';
import { LoginValidator } from '../auth.validators';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  constructor(public signinService: SignInService, public router: Router, private toast: ToastService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        LoginValidator.patternValidator(/\d/, { hasNumber: true }),
        LoginValidator.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        LoginValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),
        LoginValidator.patternValidator(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, { hasSpecialCharacters: true }),
      ]),
    });
  }

  form: FormGroup = new FormGroup({});

  submit() {
    if (this.form.valid) {
      let { login, password } = this.form.value;
      this.signinService
        .signUp({ ...this.form.value })
        .pipe(
          map(data => {
            this.toast.showToasterSuccess('You have successfully signed');
            this.signinService.signIn({ login, password }).subscribe(res => {
              this.router.navigate(['/']);
              return res;
            });
            return data;
          })
        )
        .subscribe(res => {
          return res;
        });
    }
  }
}
