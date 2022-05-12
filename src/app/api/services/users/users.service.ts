import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../consts';
import { IUser } from '../../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<Array<IUser>>(`${BASE_URL}users`);
  }

  getUserById(id: string) {
    this.http.get(`${BASE_URL}users/${id}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  deleteUser(id: string) {
    this.http.delete(`${BASE_URL}users/${id}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  updateUser(id: string, user: IUser) {
    this.http.put(`${BASE_URL}users/${id}`, user).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
