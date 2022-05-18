import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBoardItem } from '../../models/board-item.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/state.model';
import { getStoreBoards } from '../../../store/selectors/boards.selectors';
import { clearBoards, fetchBoards } from '../../../store/actions/boards.actions';
import { Observable, Subscription } from 'rxjs';
import { SearchTasksService } from '../../services/search-tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  public boards$!: Observable<IBoardItem[]>;

  private subscriptions: Subscription[] = [];

  inputSearch: string = '';

  constructor(
    private readonly boardsService: BoardsService,
    private store: Store<State>,
    private readonly searchTasksService: SearchTasksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.boards$ = this.store.select(getStoreBoards);
    this.loadBoards();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private loadBoards = (): void => {
    const subscription = this.boardsService.getBoards().subscribe({
      next: (boards: IBoardItem[]) => {
        this.store.dispatch(fetchBoards({ boards }));
      },
      error: () => {
        this.store.dispatch(clearBoards());
      },
    });

    this.subscriptions.push(subscription);
  };

  public searchTask() {
    this.searchTasksService.changeTitleSearch(this.inputSearch);
    this.router.navigate(['/search']);
  }
}
