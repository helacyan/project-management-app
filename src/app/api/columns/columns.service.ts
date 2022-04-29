import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../consts';
import { IColumn } from '../utils/models/api.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient) {}

  getColumns(id: string) {
    this.http.get(`${BASE_URL}boards/${id}/columns`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  createColumns(id: string, column: IColumn) {
    this.http.post(`${BASE_URL}boards/${id}/columns`, column).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  getColumnById(boardId: string, columnId: string) {
    this.http.get(`${BASE_URL}boards/${boardId}/columns/${columnId}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  deleteColumn(boardId: string, columnId: string) {
    this.http.delete(`${BASE_URL}boards/${boardId}/columns/${columnId}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  updateColumn(boardId: string, columnId: string, column: IColumn) {
    this.http.put(`${BASE_URL}boards/${boardId}/columns/${columnId}`, column).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
