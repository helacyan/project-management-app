import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/api/services/users/users.service';
import { LoginValidator } from 'src/app/auth/pages/auth.validators';
import jwt_decode from 'jwt-decode';
import { ToastService } from 'src/app/api/services/auth/toast.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  constructor(
    public usersService: UsersService,
    private toast: ToastService,
    private modal: OpenConfirmationModalService
  ) {}

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
      let decoded: { userId: string; login: string } = jwt_decode(localStorage.getItem('userToken') as string);
      this.usersService.getUsers().subscribe(res => {
        res.find(u =>
          u.login == this.form.value.login
            ? this.toast.showToasterError('User with this login already exists')
            : this.usersService.updateUser(decoded.userId, { ...this.form.value })
        );
      });
    }
  }

  public deleteUser() {
    let decoded: { userId: string } = jwt_decode(localStorage.getItem('userToken') as string);
    this.modal.openConfirmationDialog().subscribe(res => (res ? this.usersService.deleteUser(decoded.userId) : null));
  }
}
