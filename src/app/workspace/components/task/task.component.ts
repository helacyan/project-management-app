import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, mergeMap, Subscription } from 'rxjs';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { fetchColumns } from 'src/app/store/actions/columns.actions';
import { selectCurrentUserId, selectUser } from 'src/app/store/selectors/users.selectors';
import { IBoardItem } from '../../models/board-item.model';
import { ITaskItem } from '../../models/task-item.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  public boardId!: string;

  public title!: string;

  public order!: number;

  public description!: string;

  public executor!: string;

  public done!: boolean;

  public isTaskOwnByCurrentUser$!: BehaviorSubject<boolean>;

  private subscriptions: Subscription[] = [];

  @Input() task!: ITaskItem;

  @Input() columnId!: string;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private usersService: UsersService,
    private boardsService: BoardsService,
    private tasksService: TasksService,
    private dialog: MatDialog,
    private readonly openConfirmationModalService: OpenConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.boardId = this.route.snapshot.params.id;
    this.title = this.task.title;
    this.description = this.task.description;
    this.setExecutor();
    this.done = this.task.done;
    this.isTaskOwnByCurrentUser$ = new BehaviorSubject<boolean>(true);
    this.checkTaskExecutor();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private fetchExecutor = (): void => {
    const subscription = this.usersService.getUserById(this.task.userId).subscribe(user => {
      this.executor = user.name;
    });
    this.subscriptions.push(subscription);
  };

  private setExecutor = (): void => {
    const subscription = this.store.select(selectUser(this.task.userId)).subscribe(user => {
      if (user) {
        this.executor = user.name;
      } else {
        this.fetchExecutor();
      }
    });
    this.subscriptions.push(subscription);
  };

  private checkTaskExecutor = (): void => {
    const subscription = this.store.select(selectCurrentUserId).subscribe(currentUserId => {
      if (currentUserId === this.task.userId) {
        this.isTaskOwnByCurrentUser$.next(true);
      } else {
        this.isTaskOwnByCurrentUser$.next(false);
      }
    });

    this.subscriptions.push(subscription);
  };

  private updateColumnsState = (board: IBoardItem) =>
    this.store.dispatch(fetchColumns({ columns: board.columns || [] }));

  private deleteTask = (): void => {
    const subscription = this.tasksService
      .deleteTask(this.boardId, this.columnId, this.task.id)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));

    this.subscriptions.push(subscription);
  };

  public onDeleteButtonClick() {
    const subscription = this.openConfirmationModalService.openConfirmationDialog().subscribe(res => {
      if (res === true) {
        this.deleteTask();
      }
    });

    this.subscriptions.push(subscription);
  }
}
