import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BASE_URL } from '../../consts';
import { ILogin, IUser } from '../../models/api.model';
import { UtilsService } from '../utils/utils.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(private http: HttpClient, private utils: UtilsService, private toast: ToastService) {}

  signUp(user: IUser) {
    this.http.post(`${BASE_URL}signup`, user).subscribe({
      next: data => {
        this.toast.showToasterSuccess('You have successfully registered');
        return data;
      },
      error: error => console.log(error),
    });
  }

  signIn(login: ILogin) {
    return this.http.post<{ token: string }>(`${BASE_URL}signin`, login).pipe(
      map((data: { token: string }) => {
        this.utils.setLocalStorage(login.login, data.token);
        return data.token;
      })
    );
  }
}
