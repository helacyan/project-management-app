import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';
import { BASE_URL } from '../../consts';
import { IColumn } from '../../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient) {}

  getColumns = (boardId: string): Observable<IColumnItem[]> => {
    return this.http.get<IColumnItem[]>(`${BASE_URL}boards/${boardId}/columns`);
  };

  createColumn(boardId: string, column: IColumn) {
    return this.http.post(`${BASE_URL}boards/${boardId}/columns`, column);
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
