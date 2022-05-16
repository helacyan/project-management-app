import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, mergeMap, Observable, Subscription } from 'rxjs';
import { IColumn, ITask } from 'src/app/api/models/api.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { ColumnsService } from 'src/app/api/services/columns/columns.service';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { fetchColumns } from 'src/app/store/actions/columns.actions';
import { IBoardItem } from '../../models/board-item.model';
import { IColumnItem } from '../../models/column-item.model';
import { ITaskItem } from '../../models/task-item.model';
import { CreateTaskModalComponent } from '../modals/create-task-modal/create-task-modal.component';
import { TITLE_ERRORS_MESSAGES } from '../modals/consts';
import { selectCurrentUserId } from 'src/app/store/selectors/users.selectors';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit, OnDestroy {
  public currentUserId$!: Observable<string>;

  public currentUserId!: string;

  private boardId!: string;

  public title$!: BehaviorSubject<string>;

  public tasks$!: BehaviorSubject<ITaskItem[]>;

  public tasks!: ITaskItem[];

  public isTitleEnabled$ = new BehaviorSubject<boolean>(false);

  public isTitleDisabled$ = new BehaviorSubject<boolean>(true);

  public editTitleForm!: FormGroup;

  public readonly TITLE_ERRORS_MESSAGES = TITLE_ERRORS_MESSAGES;

  private subscriptions: Subscription[] = [];

  @Input() column!: IColumnItem;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private boardsService: BoardsService,
    private columnsService: ColumnsService,
    private tasksService: TasksService,
    private dialog: MatDialog,
    private readonly openConfirmationModalService: OpenConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.currentUserId$ = this.store.select(selectCurrentUserId);
    this.setCurrentUserId();
    this.boardId = this.route.snapshot.params.id;
    this.title$ = new BehaviorSubject<string>(this.column.title);
    this.editTitleForm = this.fb.group({
      title: [this.column.title, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
    this.tasks$ = new BehaviorSubject<ITaskItem[]>(this.column.tasks || []);
    this.updateTasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setCurrentUserId = (): void => {
    const subscription = this.currentUserId$.subscribe(currentUserId => (this.currentUserId = currentUserId));
    this.subscriptions.push(subscription);
  };

  private updateTasks = (): void => {
    const subscription = this.tasks$.subscribe(tasks => (this.tasks = tasks));
    this.subscriptions.push(subscription);
  };

  public enableTitleEditMode = (): void => {
    this.isTitleEnabled$.next(true);
    this.isTitleDisabled$.next(false);
  };

  private disableTitleEditMode = (): void => {
    this.isTitleEnabled$.next(false);
    this.isTitleDisabled$.next(true);
  };

  private updateColumn = (newColumn: IColumn): void => {
    const subscription = this.columnsService
      .updateColumn(this.boardId, this.column.id, newColumn)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.store.dispatch(fetchColumns({ columns: board.columns || [] })));

    this.subscriptions.push(subscription);
  };

  public onTitleEditSubmit = (): void => {
    const newTitle = this.editTitleForm.controls.title.value;
    if (this.title$.value !== newTitle) {
      this.title$.next(newTitle);
      const newColumn: IColumn = {
        title: newTitle,
        order: this.column.order,
      };
      this.updateColumn(newColumn);
    }

    this.disableTitleEditMode();
  };

  public onTitleEditCancel = (): void => {
    this.disableTitleEditMode();
  };

  private deleteColumn = (): void => {
    const subscription = this.columnsService
      .deleteColumn(this.boardId, this.column.id)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.store.dispatch(fetchColumns({ columns: board.columns || [] })));

    this.subscriptions.push(subscription);
  };

  public onDeleteButtonClick() {
    const subscription = this.openConfirmationModalService.openConfirmationDialog().subscribe(res => {
      if (res === true) {
        this.deleteColumn();
      }
    });

    this.subscriptions.push(subscription);
  }

  private getNewTaskOrder = (): number => {
    const tasksOrders: number[] = this.tasks.map(task => task.order);
    return tasksOrders.length ? Math.max(...tasksOrders) + 1 : 1;
  };

  private getNewTaskNumber = (columns: IColumnItem[]) => {
    const tasksNumbers: number[] = columns
      .map(column => column.tasks || [])
      .flat()
      .map(task => +task?.title.slice(task?.title.indexOf('#') + 1));

    return tasksNumbers.length ? Math.max(...tasksNumbers) + 1 : 1;
  };

  private createTask = (task: Pick<ITask, 'title' | 'description'>): void => {
    const subscription = this.boardsService
      .getBoardById(this.boardId)
      .pipe(
        mergeMap((board: IBoardItem) => {
          const columns = board.columns || [];
          const tasks: ITaskItem[] = board.columns?.find(column => column.id === this.column.id)?.tasks || [];
          this.tasks$.next([...tasks]);

          const newTask: ITask = {
            title: `${task.title} #${this.getNewTaskNumber(columns)}`,
            done: false,
            order: this.getNewTaskOrder(),
            description: task.description,
            userId: this.currentUserId,
          };
          return this.tasksService.createTask(this.boardId, this.column.id, newTask);
        })
      )
      .subscribe((createdTask: ITaskItem) => this.tasks$.next([...this.tasks, createdTask]));

    this.subscriptions.push(subscription);
  };

  public openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskModalComponent, {
      width: '300px',
      position: {
        top: 'calc(70px + 2rem)',
      },
    });

    const subscription = dialogRef.afterClosed().subscribe((task: Pick<ITask, 'title' | 'description'>) => {
      if (task) {
        this.createTask(task);
      }
    });
    this.subscriptions.push(subscription);
  }
}
