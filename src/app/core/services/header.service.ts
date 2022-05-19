import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UtilsService } from 'src/app/api/services/utils/utils.service';
import { State } from 'src/app/store/state.model';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private visibleEditBtn: boolean;

  public visibleCreateBtn: boolean;

  constructor(private store: Store<State>, private readonly utilsService: UtilsService) {
    this.visibleEditBtn = false;
    this.visibleCreateBtn = false;
  }

  hideCreateBtn() {
    this.visibleCreateBtn = false;
  }

  showCreateBtn() {
    this.visibleCreateBtn = true;
  }

  getEditBtn() {
    const token = this.utilsService.getTokenFromStorage();
    return (this.visibleEditBtn = token ? true : false);
  }

  getCreateBtn() {
    return this.visibleCreateBtn;
  }
}
