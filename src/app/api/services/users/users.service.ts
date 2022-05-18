import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserItem } from 'src/app/workspace/models/user-item.model';
import { BASE_URL } from '../../consts';
import { IUser } from '../../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers = (): Observable<IUserItem[]> => this.http.get<IUserItem[]>(`${BASE_URL}users`);

  getUserById = (id: string): Observable<IUserItem> => this.http.get<IUserItem>(`${BASE_URL}users/${id}`);

  deleteUser(id: string) {
    this.http.delete(`${BASE_URL}users/${id}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
    localStorage.clear();
  }

  updateUser(id: string, user: IUser) {
    this.http.put(`${BASE_URL}users/${id}`, user).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
