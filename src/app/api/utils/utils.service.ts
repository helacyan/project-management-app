import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  setLocalStorage(token: string) {
    localStorage.setItem('userInfo', JSON.stringify(token));
  }

  getLocalStorage = (): string | null => {
    const userInfoObj: string | null = localStorage.getItem('userInfo');
    if (userInfoObj) return userInfoObj;
    return null;
  };

  getTokenFromStorage = () => {
    const res: string | null = this.getLocalStorage();
    if (res) return JSON.parse(res);
  };
}
