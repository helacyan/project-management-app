import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../consts';
import { ILogin, IUser } from '../utils/models/api.model';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(private http: HttpClient, private utils: UtilsService) {}

  signUp(user: IUser) {
    this.http.post(`${BASE_URL}signup`, user).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  signIn(login: ILogin) {
    this.http.post<{ token: string }>(`${BASE_URL}signin`, login).subscribe({
      next: data => this.utils.setLocalStorage(data.token),
      error: error => console.log(error.error.message),
    });
  }
}
