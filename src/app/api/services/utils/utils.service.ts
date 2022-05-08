import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  setLocalStorage(login: string, token: string) {
    localStorage.setItem('userLogin', login);
    localStorage.setItem('userToken', token);
  }

  getLoginFromStorage = () => localStorage.getItem('userLogin');

  getTokenFromStorage = () => {
    return localStorage.getItem('userToken');
  };
}
