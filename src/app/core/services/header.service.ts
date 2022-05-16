import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  visibleEditBtn: boolean;

  visibleCreateBtn: boolean;

  constructor() {
    this.visibleEditBtn = false;
    this.visibleCreateBtn = false;
  }

  hideEditBtn() {
    this.visibleEditBtn = false;
  }

  hideCreateBtn() {
    this.visibleCreateBtn = false;
  }

  showEditBtn() {
    this.visibleEditBtn = true;
  }

  showCreateBtn() {
    this.visibleCreateBtn = true;
  }
}
