import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  setLocalStorage(token: string) {
    localStorage.setItem('userInfo', JSON.stringify(token));
  }

  getTokenFromStorage = () => {
    return localStorage.getItem('userInfo');
  };
}
