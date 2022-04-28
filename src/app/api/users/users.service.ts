import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    this.http.get(`${baseUrl}users`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  getUserById(id: string) {
    this.http.get(`${baseUrl}users/${id}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  deleteUser(id: string) {
    this.http.delete(`${baseUrl}users/${id}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  updateUser(id: string, name: string, login: string, password: string) {
    const options = {
      name: name,
      login: login,
      password: password,
    };
    this.http.put(`${baseUrl}users/${id}`, options).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
