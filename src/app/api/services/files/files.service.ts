import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../consts';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  fileName: string = '';

  formData = new FormData();

  constructor(private http: HttpClient) {}

  uploadFile(file: File, taksId: string) {
    if (file) {
      let formParams = new FormData();
      formParams.append('file', file);
      formParams.append('taskId', taksId);
      let upload$ = this.http.post(`${BASE_URL}file`, formParams);
      upload$.subscribe({
        next: data => data,
        error: error => console.log(error.error.message),
      });
    }
  }

  downloadFile(taskId: string, filename: string) {
    this.http.get(`${BASE_URL}file/${taskId}/${filename}`, { responseType: 'blob' }).subscribe(data => {
      saveAs(data, `${filename}`);
    });
  }
}
