import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFileItem } from 'src/app/workspace/models/file-item.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private http: HttpClient) {}

  uploadFile = (file: File, taksId: string): Observable<IFileItem> => {
    let formParams = new FormData();
    formParams.append('file', file);
    formParams.append('taskId', taksId);
    return this.http.post<IFileItem>(`${environment.API_URL}file`, formParams);
  };

  downloadFile = (taskId: string, filename: string) => {
    return this.http.get(`${environment.API_URL}file/${taskId}/${filename}`, { responseType: 'blob' });
  };
}
