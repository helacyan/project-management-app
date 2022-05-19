import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserItem } from 'src/app/workspace/models/user-item.model';
import { environment } from 'src/environments/environment';
import { IUser } from '../../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers = (): Observable<IUserItem[]> => this.http.get<IUserItem[]>(`${environment.API_URL}users`);

  getUserById = (id: string): Observable<IUserItem> => this.http.get<IUserItem>(`${environment.API_URL}users/${id}`);

  deleteUser(id: string) {
    this.http.delete(`${environment.API_URL}users/${id}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  updateUser(id: string, user: IUser) {
    this.http.put(`${environment.API_URL}users/${id}`, user).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
