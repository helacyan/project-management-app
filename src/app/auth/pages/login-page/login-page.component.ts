import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap, Subscription } from 'rxjs';
import { SignInService } from 'src/app/api/services/auth/sign-in.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { fetchUsers } from 'src/app/store/actions/users.actions';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    public signinService: SignInService,
    private usersService: UsersService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  form: FormGroup = new FormGroup({});

  submit() {
    if (this.form.valid) {
      const subscription = this.signinService
        .signIn({ ...this.form.value })
        .pipe(mergeMap(() => this.usersService.getUsers()))
        .subscribe(users => {
          this.store.dispatch(fetchUsers({ users }));
          return localStorage.getItem('userToken') ? this.router.navigate(['/']) : null;
        });
      this.subscriptions.push(subscription);
    }
    return;
  }
}
