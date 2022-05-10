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

  getColumns = (boardId: string): Observable<IColumn[]> => {
    return this.http.get<IColumn[]>(`${BASE_URL}boards/${boardId}/columns`);
  };

  createColumn = (boardId: string, column: IColumn): Observable<IColumn> => {
    return this.http.post<IColumn>(`${BASE_URL}boards/${boardId}/columns`, column);
  };

  getColumnById = (boardId: string, columnId: string): Observable<IColumnItem> => {
    return this.http.get<IColumnItem>(`${BASE_URL}boards/${boardId}/columns/${columnId}`);
  };

  deleteColumn = (boardId: string, columnId: string): Observable<IColumn> => {
    return this.http.delete<IColumn>(`${BASE_URL}boards/${boardId}/columns/${columnId}`);
  };

  updateColumn = (boardId: string, columnId: string, column: IColumn): Observable<IColumn> => {
    return this.http.put<IColumn>(`${BASE_URL}boards/${boardId}/columns/${columnId}`, column);
  };
}
