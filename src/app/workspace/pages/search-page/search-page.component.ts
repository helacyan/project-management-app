import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, forkJoin, map, mergeMap, Subject, Subscription, takeUntil } from 'rxjs';
import { IUser } from 'src/app/api/models/api.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { getStoreBoards } from 'src/app/store/selectors/boards.selectors';
import { State } from 'src/app/store/state.model';
import { IBoardItem } from '../../models/board-item.model';
import { ITaskItem } from '../../models/task-item.model';
import { SearchTasksService } from '../../services/search-tasks.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchedItems: Array<ITaskItem> = [];

  searchSubscription: Subscription | null = null;

  inputSearch: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly boardsService: BoardsService,
    private readonly tasksService: TasksService,
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
          return this.store.pipe(select(getStoreBoards)).pipe(
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
              let searchedTasks = this.searchByTag(users, enrichedBoards, searchable);
              this.searchedItems = searchedTasks;
            })
          );
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }

  private searchByTag(users: IUser[], enrichedBoards: IBoardItem[], searchable: string): ITaskItem[] {
    let allTasks = enrichedBoards.flatMap(board => board.columns!.flatMap(column => column.tasks));

    searchable = searchable.toLowerCase().trim();

    let tasks = allTasks.filter(
      task => task!.title.toLowerCase().includes(searchable) || task!.description.toLowerCase().includes(searchable)
    );

    let foundUsers = users.filter(user => user.name.toLowerCase().includes(searchable));
    if (foundUsers.length > 0) {
      let tasksByUserName = allTasks.filter(task => foundUsers.find(user => user.id === task.userId));
      tasks = tasks.concat(tasksByUserName);
    }
    console.log(tasks);
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
