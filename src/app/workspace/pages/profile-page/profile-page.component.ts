import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/api/services/users/users.service';
import { LoginValidator } from 'src/app/auth/pages/auth.validators';
import jwt_decode from 'jwt-decode';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  constructor(public usersService: UsersService, private modal: OpenConfirmationModalService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
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
      let decoded: { userId: string; login: string } = jwt_decode(localStorage.getItem('userToken') as string);
      this.usersService.getUsers().subscribe(res => {
        res.find(u =>
          u.login == decoded.login
            ? this.usersService.updateUser(decoded.userId, { login: decoded.login, name: u.name, ...this.form.value })
            : null
        );
      });
    }
  }

  public deleteUser() {
    let decoded: { userId: string } = jwt_decode(localStorage.getItem('userToken') as string);
    this.modal
      .openConfirmationDialog()
      .subscribe(res =>
        res ? (this.usersService.deleteUser(decoded.userId), this.router.navigate(['/welcome'])) : null
      );
  }
}
