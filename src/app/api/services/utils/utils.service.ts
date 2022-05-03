import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  setLocalStorage(token: string) {
    localStorage.setItem('userInfo', token);
  }

  getTokenFromStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo') as string);
  };
}
