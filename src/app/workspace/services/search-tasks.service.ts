import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchTasksService {
  public tagSearch$ = new Subject<string>();

  public changeTitleSearch(tagSearch: string) {
    this.tagSearch$.next(tagSearch);
  }
}
