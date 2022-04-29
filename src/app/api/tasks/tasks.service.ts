import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../consts';
import { ITask, IUpdateTask } from '../utils/models/api.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks(boardId: string, columnId: string) {
    this.http.get(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  createTask(boardId: string, columnId: string, task: ITask) {
    this.http.post(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks`, task).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  getTaskById(boardId: string, columnId: string, taskId: string) {
    this.http.get(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  deleteTask(boardId: string, columnId: string, taskId: string) {
    this.http.delete(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  updateTask(taskId: string, updatedTask: IUpdateTask) {
    const { boardId, columnId } = updatedTask;
    this.http.put(`${BASE_URL}boards/${boardId}/columns/${columnId}/tasks/${taskId}`, updatedTask).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
