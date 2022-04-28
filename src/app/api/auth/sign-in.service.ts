import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../consts';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(private http: HttpClient, private utils: UtilsService) {}

  signUp(name: string, login: string, password: string) {
    const options = {
      name: name,
      login: login,
      password: password,
    };
    this.http.post(`${baseUrl}signup`, options).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  signIn(login: string, password: string) {
    const options = {
      login: login,
      password: password,
    };
    this.http.post<{ token: string }>(`${baseUrl}signin`, options).subscribe({
      next: data => this.utils.setLocalStorage(data.token),
      error: error => console.log(error.error.message),
    });
  }
}
