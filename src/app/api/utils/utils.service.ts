import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  setLocalStorage(token: string) {
    const userInfoObj = JSON.stringify(token);
    localStorage.setItem('userInfo', userInfoObj);
  }

  getLocalStorage = (): string | void => {
    if (localStorage.getItem('userInfo')) {
      const userInfoObj: string | null = localStorage.getItem('userInfo');
      if (userInfoObj) return userInfoObj;
    }
  };

  getTokenFromStorage = () => {
    const res: string | void = this.getLocalStorage();
    if (res) return JSON.parse(res);
  };
}
