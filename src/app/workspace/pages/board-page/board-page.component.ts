import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { concat, map, mergeMap, Observable, Subscription } from 'rxjs';
import { IColumn, IUpdateTask } from 'src/app/api/models/api.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { ColumnsService } from 'src/app/api/services/columns/columns.service';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { UtilsService } from 'src/app/api/services/utils/utils.service';
import {
  addColumn,
  clearColumns,
  disableCdkDrag,
  enableCdkDrag,
  loadColumns,
  moveColumns,
  replaceColumn,
} from 'src/app/store/actions/columns.actions';
import { fetchUsers, setCurrentUserId } from 'src/app/store/actions/users.actions';
import { selectCdkDragDisabled, selectColumns } from 'src/app/store/selectors/columns.selectors';
import { selectCurrentUserId } from 'src/app/store/selectors/users.selectors';
import { moveItemInArray, transferArrayItem } from 'src/app/store/utils/ngrx-cdk-drag-utils';
import { CreateColumnModalComponent } from '../../components/modals/create-column-modal/create-column-modal.component';
import { IBoardItem } from '../../models/board-item.model';
import { IColumnItem } from '../../models/column-item.model';
import { ITaskItem, ITaskItemExtended } from '../../models/task-item.model';
import { IUserItem } from '../../models/user-item.model';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
})
export class BoardPageComponent implements OnInit, OnDestroy {
  public currentUserId$!: Observable<string>;

  public currentUserId!: string;

  private boardId!: string;

  public boardTitle!: string;

  public columns$!: Observable<IColumnItem[]>;

  private columns!: IColumnItem[];

  public cdkDragDisabled$!: Observable<boolean>;

  public connectedList!: string[];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private usersService: UsersService,
    private boardsService: BoardsService,
    private columnsService: ColumnsService,
    private tasksService: TasksService,
    private utilsService: UtilsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
    this.setCurrentUserId();
    this.boardId = this.route.snapshot.params.id;
    this.columns$ = this.store.select(selectColumns);
    this.cdkDragDisabled$ = this.store.select(selectCdkDragDisabled);
    this.initState();
    this.updateColumns();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.store.dispatch(clearColumns());
  }

  private redirectToErrorPage = (): void => {
    this.router.navigate(['error']);
  };

  private setCurrentUserId = (): void => {
    const subscription = this.currentUserId$.subscribe(currentUserId => (this.currentUserId = currentUserId));
    this.subscriptions.push(subscription);
  };

  private updateColumns = (): void => {
    const subscription = this.columns$.subscribe(columns => {
      this.columns = columns;
      this.connectedList = columns.map(column => column.id);
    });
    this.subscriptions.push(subscription);
  };

  private initState = (): void => {
    const subscription = this.usersService
      .getUsers()
      .pipe(
        map((users: IUserItem[]) => {
          this.store.dispatch(fetchUsers({ users }));
          const currentUserLogin: string | null = this.utilsService.getLoginFromStorage();
          if (currentUserLogin) {
            const currentUserId: string = users.find(user => user.login === currentUserLogin)?.id || '';
            this.store.dispatch(setCurrentUserId({ currentUserId }));
          }
        }),
        mergeMap(() => this.boardsService.getBoardById(this.boardId))
      )
      .subscribe({
        next: (board: IBoardItem) => {
          this.boardTitle = board.title;
          this.connectedList = board.columns!.map(column => column.id);
          this.store.dispatch(loadColumns({ columns: board.columns || [] }));
        },
        error: () => this.redirectToErrorPage(),
      });
    this.subscriptions.push(subscription);
  };

  private getNewColumnOrder = (): number => {
    const columnsOrders: number[] = this.columns.map(column => column.order);
    return columnsOrders.length ? Math.max(...columnsOrders) + 1 : 1;
  };

  private createColumn = (title: string): void => {
    const subscription = this.boardsService
      .getBoardById(this.boardId)
      .pipe(
        mergeMap((board: IBoardItem) => {
          const columns = board.columns || [];
          this.store.dispatch(loadColumns({ columns }));
          const newColumn: IColumn = {
            title,
            order: this.getNewColumnOrder(),
          };
          return this.columnsService.createColumn(this.boardId, newColumn);
        })
      )
      .subscribe({
        next: (column: IColumnItem) => {
          this.store.dispatch(addColumn({ column }));
        },
        error: () => this.redirectToErrorPage(),
      });

    this.subscriptions.push(subscription);
  };

  public openCreateColumnDialog(): void {
    const dialogRef = this.dialog.open(CreateColumnModalComponent, {
      width: '300px',
      position: {
        top: 'calc(70px + 2rem)',
      },
    });

    const subscription = dialogRef.afterClosed().subscribe((title: string) => {
      if (title) this.createColumn(title);
    });
    this.subscriptions.push(subscription);
  }

  public dropColumn = (event: CdkDragDrop<IColumnItem[]>): void => {
    const previousIndex: number = event.previousIndex;
    const currentIndex: number = event.currentIndex;

    if (previousIndex === currentIndex) return;
    this.store.dispatch(moveColumns({ previousIndex, currentIndex }));
    this.store.dispatch(disableCdkDrag());

    const updatedColumns: IColumnItem[] = [];

    let requests: Observable<IColumnItem>[] = [];

    const zeroOrderRequest$: Observable<IColumnItem> = this.columnsService.updateColumn(
      this.boardId,
      this.columns[currentIndex].id,
      {
        title: this.columns[currentIndex].title,
        order: 0,
      }
    );

    const setUpdatedColumns = (cb: (column: IColumnItem, index: number) => IColumnItem | null): void => {
      this.columns.forEach((column, index) => {
        const updatedColumn: IColumnItem | null = cb(column, index);

        if (updatedColumn) {
          const request$: Observable<IColumnItem> = this.columnsService.updateColumn(this.boardId, column.id, {
            title: updatedColumn.title,
            order: updatedColumn.order,
          });
          requests.push(request$);
          updatedColumns.push(updatedColumn);
        } else {
          updatedColumns.push(column);
        }
      });
    };

    if (previousIndex < currentIndex) {
      const getUpdatedColumn = (column: IColumnItem, index: number): IColumnItem | null => {
        if (index >= previousIndex && index < currentIndex) {
          return {
            ...column,
            order: column.order > 1 ? column.order - 1 : 1,
          };
        } else if (index === currentIndex) {
          return {
            ...column,
            order: this.columns[index - 1].order,
          };
        } else {
          return null;
        }
      };

      setUpdatedColumns(getUpdatedColumn);
    }

    if (previousIndex > currentIndex) {
      const getUpdatedColumn = (column: IColumnItem, index: number): IColumnItem | null => {
        if (index > currentIndex && index <= previousIndex) {
          return {
            ...column,
            order: column.order + 1,
          };
        } else if (index === currentIndex) {
          return {
            ...column,
            order: this.columns[index + 1].order,
          };
        } else {
          return null;
        }
      };
      setUpdatedColumns(getUpdatedColumn);
      requests = requests.reverse();
    }

    const subscription = concat(zeroOrderRequest$, ...requests).subscribe({
      complete: () => {
        this.store.dispatch(loadColumns({ columns: updatedColumns }));
        this.store.dispatch(enableCdkDrag());
      },
    });

    this.subscriptions.push(subscription);
  };

  public sortTasks = (column: IColumnItem): ITaskItem[] => {
    if (!column.tasks || !column.tasks.length) return [];
    return column.tasks.slice().sort((a, b) => (a.order > b.order ? 1 : -1));
  };

  public dropTask = (event: CdkDragDrop<ITaskItem[]>): void => {
    const previousIndex: number = event.previousIndex;
    const currentIndex: number = event.currentIndex;
    const previousColumnId: string = event.previousContainer.id;
    const currentColumnId: string = event.container.id;
    const previousColumnTasks: ITaskItem[] = event.previousContainer.data;

    this.store.dispatch(disableCdkDrag());

    const updateColumnsState = (columnIndex: number, updatedTasks: ITaskItem[]): void => {
      const updatedColumn = { ...this.columns[columnIndex], tasks: updatedTasks };
      this.store.dispatch(replaceColumn({ columnIndex, updatedColumn }));
    };

    let requests: Observable<ITaskItem>[] = [];

    const getUpdatedTaskFromTaskItem = (task: ITaskItem, order: number, columnId: string): IUpdateTask => {
      return {
        title: task.title,
        done: task.done,
        order: order,
        description: task.description,
        userId: task.userId,
        boardId: this.boardId,
        columnId: columnId,
      };
    };

    const setUpdatedTasks = (
      movedTasks: ITaskItem[],
      updatedTasks: ITaskItem[],
      cb: (task: ITaskItem, index: number) => IUpdateTask | null
    ): void => {
      movedTasks.forEach((task, index) => {
        const updatedTask: IUpdateTask | null = cb(task, index);

        const columnIdReq: string =
          previousColumnId !== currentColumnId && index === currentIndex ? previousColumnId : currentColumnId;

        if (updatedTask) {
          updatedTasks.push({ ...task, order: updatedTask.order });
          const request$: Observable<ITaskItem> = this.tasksService.updateTask(
            this.boardId,
            columnIdReq,
            task.id,
            updatedTask
          );
          requests.push(request$);
        } else {
          updatedTasks.push(task);
          return;
        }
      });
    };

    if (event.previousContainer === event.container) {
      const columnIndex: number = this.columns.findIndex(column => column.id === previousColumnId);
      const movedTasks: ITaskItem[] = moveItemInArray(event.container.data, previousIndex, currentIndex);
      const updatedTasks: ITaskItem[] = [];

      if (previousIndex === currentIndex) {
        this.store.dispatch(enableCdkDrag());
        return;
      }

      const taskToUpdate: ITaskItem = previousColumnTasks[previousIndex];
      const updatedTask: IUpdateTask = getUpdatedTaskFromTaskItem(taskToUpdate, 0, previousColumnId);
      const zeroOrderRequest$ = this.tasksService.updateTask(
        this.boardId,
        previousColumnId,
        taskToUpdate.id,
        updatedTask
      );

      if (previousIndex < currentIndex) {
        const getUpdatedTask = (task: ITaskItem, index: number): IUpdateTask | null => {
          let order: number;
          if (index >= previousIndex && index < currentIndex) {
            order = task.order > 1 ? task.order - 1 : 1;
          } else if (index === currentIndex) {
            order = movedTasks[index - 1].order;
          } else {
            return null;
          }

          if (order) {
            return getUpdatedTaskFromTaskItem(task, order, currentColumnId);
          } else {
            return null;
          }
        };

        setUpdatedTasks(movedTasks, updatedTasks, getUpdatedTask);
      }

      if (previousIndex > currentIndex) {
        const getUpdatedTask = (task: ITaskItem, index: number): IUpdateTask | null => {
          if (index > currentIndex && index <= previousIndex) {
            const order: number = task.order + 1;
            return getUpdatedTaskFromTaskItem(task, order, currentColumnId);
          } else if (index === currentIndex) {
            const order: number = movedTasks[index + 1].order;
            return getUpdatedTaskFromTaskItem(task, order, currentColumnId);
          } else {
            return null;
          }
        };
        setUpdatedTasks(movedTasks, updatedTasks, getUpdatedTask);
        requests = requests.reverse();
      }

      updateColumnsState(columnIndex, updatedTasks);

      const subscription = concat(zeroOrderRequest$, ...requests).subscribe({
        complete: () => {
          this.store.dispatch(enableCdkDrag());
        },
      });

      this.subscriptions.push(subscription);
    } else {
      const transferedColumns = transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        previousIndex,
        currentIndex
      );

      const updatePreviousColumn = (): void => {
        const columnIndex = this.columns.findIndex(column => column.id === previousColumnId);
        const updatedTasks = transferedColumns.previousArray;

        updateColumnsState(columnIndex, updatedTasks);
      };
      updatePreviousColumn();

      const updateCurrentColumn = (): void => {
        const columnIndex: number = this.columns.findIndex(column => column.id === currentColumnId);
        const movedTasks: ITaskItem[] = transferedColumns.currentArray;
        const updatedTasks: ITaskItem[] = [];

        const getUpdatedTask = (task: ITaskItem, index: number): IUpdateTask | null => {
          if (index === currentIndex) {
            const order: number = index > 0 ? movedTasks[index - 1].order + 1 : 1;
            return getUpdatedTaskFromTaskItem(task, order, currentColumnId);
          } else if (index > currentIndex) {
            const order: number = task.order + 1;
            return getUpdatedTaskFromTaskItem(task, order, currentColumnId);
          } else {
            return null;
          }
        };
        setUpdatedTasks(movedTasks, updatedTasks, getUpdatedTask);

        updateColumnsState(columnIndex, updatedTasks);

        const newTasksSubscription = this.tasksService
          .getTasks(this.boardId, currentColumnId)
          .pipe(
            map(tasks => {
              const newTasks: ITaskItemExtended[] = tasks.filter(
                task => task.order >= Math.max(...updatedTasks.map(updatedTask => updatedTask.order))
              );
              newTasks.forEach(newTask => {
                const request$ = this.tasksService.updateTask(this.boardId, currentColumnId, newTask.id, {
                  title: newTask.title,
                  done: newTask.done,
                  order: newTask.order + 1,
                  description: newTask.description,
                  userId: newTask.userId,
                  boardId: newTask.boardId,
                  columnId: newTask.columnId,
                });
                requests.push(request$);
              });
              return newTasks;
            })
          )
          .subscribe(() => {
            const subscription = concat(...requests.reverse()).subscribe({
              complete: () => {
                this.store.dispatch(enableCdkDrag());
              },
            });
            this.subscriptions.push(subscription);
          });

        this.subscriptions.push(newTasksSubscription);
      };
      updateCurrentColumn();
    }
  };
}
