import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignInService } from 'src/app/api/services/auth/sign-in.service';
import { LoginValidator } from '../auth.validators';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  constructor(public signinService: SignInService) {}

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
      this.signinService.signUp({ ...this.form.value });
    }
  }
}
