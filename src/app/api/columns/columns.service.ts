import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient) {}

  getColumns(id: string) {
    this.http.get(`${baseUrl}boards/${id}/columns`).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  createColumns(id: string, title: string, order: number) {
    const options = {
      title: title,
      order: order,
    };
    this.http.post(`${baseUrl}boards/${id}/columns`, options).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  getColumnById(boardId: string, columnId: string) {
    this.http.get(`${baseUrl}boards/${boardId}/columns/${columnId}`).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  deleteColumn(boardId: string, columnId: string) {
    this.http.delete(`${baseUrl}boards/${boardId}/columns/${columnId}`).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }

  updateColumn(boardId: string, columnId: string, title: string, order: number) {
    const options = {
      title: title,
      order: order,
    };
    this.http.put(`${baseUrl}boards/${boardId}/columns/${columnId}`, options).subscribe({
      next: data => console.log(data),
      error: error => console.log(error.error.message),
    });
  }
}
