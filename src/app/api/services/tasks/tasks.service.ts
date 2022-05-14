import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITaskItem } from 'src/app/workspace/models/task-item.model';
import { BASE_URL } from '../../consts';
import { ITask, IUpdateTask } from '../../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks = (boardId: string, columnId: string): Observable<ITaskItem[]> =>
    this.http.get<ITaskItem[]>(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks`);

  createTask = (boardId: string, columnId: string, task: ITask): Observable<ITaskItem> =>
    this.http.post<ITaskItem>(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks`, task);

  getTaskById = (boardId: string, columnId: string, taskId: string): Observable<ITaskItem> =>
    this.http.get<ITaskItem>(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`);

  deleteTask = (boardId: string, columnId: string, taskId: string): Observable<null> =>
    this.http.delete<null>(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`);

  updateTask = (boardId: string, columnId: string, taskId: string, updatedTask: IUpdateTask): Observable<ITaskItem> => {
    return this.http.put<ITaskItem>(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`, updatedTask);
  };
}
