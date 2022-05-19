import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBoardItem } from 'src/app/workspace/models/board-item.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<IBoardItem[]> {
    return this.http.get<Array<IBoardItem>>(`${environment.API_URL}boards`);
  }

  createBoard(title: string, description: string) {
    const options = {
      title,
      description,
    };
    return this.http.post<IBoardItem>(`${environment.API_URL}boards`, options);
  }

  getBoardById = (id: string): Observable<IBoardItem> =>
    this.http.get<IBoardItem>(`${environment.API_URL}boards/${id}`);

  deleteBoard(id: string) {
    return this.http.delete<void>(`${environment.API_URL}boards/${id}`);
  }

  updateBoard(id: string, title: string) {
    const options = {
      title,
    };
    this.http.put(`${environment.API_URL}boards/${id}`, options).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
