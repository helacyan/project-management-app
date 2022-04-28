import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks(boardId: string, columnId: string) {
    this.http.get(`${baseUrl}boards/${boardId}/columns/${columnId}/tasks`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  createTask(boardId: string, columnId: string, title: string, order: number, description: string, userId: string) {
    const options = {
      title: title,
      order: order,
      description: description,
      userId: userId,
    };
    this.http.post(`${baseUrl}boards/${boardId}/columns/${columnId}/tasks`, options).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  getTaskById(boardId: string, columnId: string, taskId: string) {
    this.http.get(`${baseUrl}boards/${boardId}/columns/${columnId}/tasks/${taskId}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  deleteTask(boardId: string, columnId: string, taskId: string) {
    this.http.delete(`${baseUrl}boards/${boardId}/columns/${columnId}/tasks/${taskId}`).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    title: string,
    description: string,
    order: number,
    userId: string
  ) {
    const options = {
      title: title,
      order: order,
      description: description,
      userId: userId,
      boardId: boardId,
      columnId: columnId,
    };
    this.http.put(`${baseUrl}boards/${boardId}/columns/${columnId}/tasks/${taskId}`, options).subscribe({
      next: data => data,
      error: error => console.log(error.error.message),
    });
  }
}
