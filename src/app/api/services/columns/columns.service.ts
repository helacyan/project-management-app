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

  getColumns = (boardId: string): Observable<IColumnItem[]> =>
    this.http.get<IColumnItem[]>(`${BASE_URL}boards/${boardId}/columns`);

  createColumn = (boardId: string, column: IColumn): Observable<IColumnItem> =>
    this.http.post<IColumnItem>(`${BASE_URL}boards/${boardId}/columns`, column);

  getColumnById = (boardId: string, columnId: string): Observable<IColumnItem> =>
    this.http.get<IColumnItem>(`${BASE_URL}boards/${boardId}/columns/${columnId}`);

  deleteColumn = (boardId: string, columnId: string): Observable<null> =>
    this.http.delete<null>(`${BASE_URL}boards/${boardId}/columns/${columnId}`);

  updateColumn = (boardId: string, columnId: string, column: IColumn): Observable<IColumnItem> =>
    this.http.put<IColumnItem>(`${BASE_URL}boards/${boardId}/columns/${columnId}`, column);
}
