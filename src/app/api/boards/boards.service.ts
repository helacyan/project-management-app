import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards() {
    this.http.get(`${baseUrl}boards`).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  createBoard(title: string) {
    const options = {
      title: title,
    };
    this.http.post(`${baseUrl}boards`, options).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  getBoardById(id: string) {
    this.http.get(`${baseUrl}boards/${id}`).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  deleteBoard(id: string) {
    this.http.delete(`${baseUrl}boards/${id}`).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  updateBoard(id: string, title: string) {
    const options = {
      title: title,
    };
    this.http.put(`${baseUrl}boards/${id}`, options).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }
}
