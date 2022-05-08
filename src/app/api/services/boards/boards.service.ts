import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBoardItem } from 'src/app/workspace/models/board-item.model';
import { BASE_URL } from '../../consts';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<IBoardItem[]> {
    return this.http.get<Array<IBoardItem>>(`${BASE_URL}boards`);
  }

  createBoard(title: string) {
    const options = {
      title,
    };
    return this.http.post<IBoardItem>(`${BASE_URL}boards`, options);
  }

  getBoardById = (id: string): Observable<IBoardItem> => {
    return this.http.get<IBoardItem>(`${BASE_URL}boards/${id}`);
  };

  deleteBoard(id: string) {
    return this.http.delete<void>(`${BASE_URL}boards/${id}`);
  }

  updateBoard(id: string, title: string) {
    const options = {
      title,
    };
    this.http.put(`${BASE_URL}boards/${id}`, options).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
