import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRegistered, IUser, LoginType } from '../../models/api.model';
import { UtilsService } from '../utils/utils.service';
@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(private http: HttpClient, private utils: UtilsService) {}

  signUp(user: IUser): Observable<IRegistered> {
    return this.http.post<IRegistered>(`${environment.API_URL}signup`, user);
  }

  signIn(login: LoginType) {
    return this.http.post<{ token: string }>(`${environment.API_URL}signin`, login).pipe(
      map((data: { token: string }) => {
        this.utils.setLocalStorage(login.login, data.token);
        return data.token;
      })
    );
  }
}
