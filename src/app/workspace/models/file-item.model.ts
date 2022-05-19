import { SafeUrl } from '@angular/platform-browser';

export interface IFileItem {
  filename: string;
  fileSize: number;
  fileUrl?: SafeUrl;
}
