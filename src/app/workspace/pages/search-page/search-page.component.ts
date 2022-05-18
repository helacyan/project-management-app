import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, forkJoin, map, mergeMap, Subject, Subscription, takeUntil } from 'rxjs';
import { IUser } from 'src/app/api/models/api.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { State } from 'src/app/store/state.model';
import { IBoardItem } from '../../models/board-item.model';
import { ITaskItemExtended } from '../../models/task-item.model';
import { SearchTasksService } from '../../services/search-tasks.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchedItems: Array<ITaskItemExtended> = [];

  searchSubscription: Subscription | null = null;

  inputSearch: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly boardsService: BoardsService,
    private readonly usersService: UsersService,
    private readonly searchTasksService: SearchTasksService,
    private store: Store<State>
  ) {}

  notifier = new Subject();

  ngOnInit() {
    const subscription = this.searchTasksService.tagSearch$
      .asObservable()
      .pipe(
        takeUntil(this.notifier),
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap(searchable => {
          return this.boardsService.getBoards().pipe(
            mergeMap(boards => {
              let observableBoards = boards.map(board => this.boardsService.getBoardById(board.id));
              observableBoards.forEach(ob => ob.subscribe());
              return forkJoin(observableBoards);
            }),
            mergeMap(enrichedBoards => {
              return this.usersService
                .getUsers()
                .pipe(map(users => [users, enrichedBoards] as [IUser[], IBoardItem[]]));
            }),
            map(([users, enrichedBoards]) => {
              this.searchedItems = this.searchByTag(users, enrichedBoards, searchable);
            })
          );
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }

  private searchByTag(users: IUser[], enrichedBoards: IBoardItem[], searchable: string): ITaskItemExtended[] {
    let allTasks: ITaskItemExtended[] = enrichedBoards.flatMap(board =>
      board.columns!.flatMap(column =>
        column.tasks!.map(task => {
          return {
            title: task.title,
            done: task.done,
            order: task.order,
            description: task.description,
            userId: task.userId,
            id: task.id,
            files: task.files,
            boardId: board.id,
            columnId: column.id,
          };
        })
      )
    );

    searchable = searchable.toLowerCase().trim();

    let tasks = allTasks.filter(
      task => task!.title.toLowerCase().includes(searchable) || task!.description.toLowerCase().includes(searchable)
    );

    let foundUsers = users.filter(user => user.name.toLowerCase().includes(searchable));
    if (foundUsers.length > 0) {
      let tasksByUserName = allTasks.filter(task => foundUsers.find(user => user.id === task.userId));
      tasks = tasks.concat(tasksByUserName);
    }
    return tasks;
  }

  public searchTask() {
    this.searchTasksService.changeTitleSearch(this.inputSearch);
  }

  ngOnDestroy() {
    this.notifier.next(null);
    this.notifier.complete();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
