import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITaskItem, ITaskItemExtended } from 'src/app/workspace/models/task-item.model';
import { environment } from 'src/environments/environment';
import { ITask, IUpdateTask } from '../../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks = (boardId: string, columnId: string): Observable<ITaskItemExtended[]> =>
    this.http.get<ITaskItemExtended[]>(`${environment.API_URL}boards/${boardId}/columns/${columnId}/tasks`);

  createTask = (boardId: string, columnId: string, task: ITask): Observable<ITaskItem> =>
    this.http.post<ITaskItem>(`${environment.API_URL}boards/${boardId}/columns/${columnId}/tasks`, task);

  getTaskById = (boardId: string, columnId: string, taskId: string): Observable<ITaskItemExtended> =>
    this.http.get<ITaskItemExtended>(`${environment.API_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`);

  deleteTask = (boardId: string, columnId: string, taskId: string): Observable<null> =>
    this.http.delete<null>(`${environment.API_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`);

  updateTask = (boardId: string, columnId: string, taskId: string, updatedTask: IUpdateTask): Observable<ITaskItem> => {
    return this.http.put<ITaskItem>(
      `${environment.API_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
      updatedTask
    );
  };
}
