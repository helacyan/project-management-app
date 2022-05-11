import { AfterContentInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, mergeMap, Subscription } from 'rxjs';
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
import { selectColumns } from 'src/app/store/selectors/columns.selectors';
import { selectCurrentUserId } from 'src/app/store/selectors/users.selectors';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit, AfterContentInit, OnDestroy {
  private currentUserId!: string | undefined;

  private boardId!: string;

  public title$!: BehaviorSubject<string>;

  public tasks!: ITaskItem[];

  private newTaskNumber!: number;

  private newTaskOrder!: number;

  public isTitleVisible$!: BehaviorSubject<boolean>;

  public isTitleInputVisible$!: BehaviorSubject<boolean>;

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
    this.boardId = this.route.snapshot.params.id;
    this.title$ = new BehaviorSubject<string>(this.column.title);
    this.isTitleVisible$ = new BehaviorSubject<boolean>(true);
    this.isTitleInputVisible$ = new BehaviorSubject<boolean>(false);
    this.editTitleForm = this.fb.group({
      title: [this.column.title, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
    this.tasks = this.column.tasks ? this.column.tasks : [];
  }

  ngAfterContentInit(): void {
    this.setCurrentUserId();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setCurrentUserId = (): void => {
    const subscription = this.store
      .select(selectCurrentUserId)
      .subscribe(currentUserId => (this.currentUserId = currentUserId));

    this.subscriptions.push(subscription);
  };

  public showEditTitleInput = (): void => {
    this.isTitleVisible$.next(false);
    this.isTitleInputVisible$.next(true);
  };

  private hideEditTitleInput = (): void => {
    this.isTitleVisible$.next(true);
    this.isTitleInputVisible$.next(false);
  };

  private updateColumnsState = (board: IBoardItem) =>
    this.store.dispatch(fetchColumns({ columns: board.columns || [] }));

  private updateColumn = (newColumn: IColumn): void => {
    const subscription = this.columnsService
      .updateColumn(this.boardId, this.column.id, newColumn)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));

    this.subscriptions.push(subscription);
  };

  public onTitleSubmit = (): void => {
    const newTitle = this.editTitleForm.controls.title.value;
    if (this.title$.value !== newTitle) {
      this.title$.next(newTitle);
      const newColumn: IColumn = {
        title: newTitle,
        order: this.column.order,
      };
      this.updateColumn(newColumn);
    }

    this.hideEditTitleInput();
  };

  public onTitleCancel = (): void => {
    this.hideEditTitleInput();
  };

  private deleteColumn = (): void => {
    const subscription = this.columnsService
      .deleteColumn(this.boardId, this.column.id)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));

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

  private updateNewTaskOrder = () => {
    const tasksOrders: number[] = this.tasks.map(task => task.order);
    this.newTaskOrder = tasksOrders.length ? Math.max(...tasksOrders) + 1 : 1;
  };

  private updateNewTaskNumber = () => {
    const subscription = this.store.select(selectColumns).subscribe(columns => {
      const tasksNumbers: number[] = columns
        .map(column => column.tasks || [])
        .flat()
        .map(task => +task?.title.slice(task?.title.indexOf('#') + 1));

      this.newTaskNumber = tasksNumbers.length ? Math.max(...tasksNumbers) + 1 : 1;
    });

    this.subscriptions.push(subscription);
  };

  private createTask = (task: ITask): void => {
    const subscription = this.tasksService
      .createTask(this.boardId, this.column.id, task)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));

    this.subscriptions.push(subscription);
  };

  public openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(CreateTaskModalComponent, {
      width: '300px',
      position: {
        top: 'calc(70px + 2rem)',
      },
    });

    const subscription = dialogRef.afterClosed().subscribe(task => {
      if (this.currentUserId) {
        this.updateNewTaskNumber();
        this.updateNewTaskOrder();
        const newTask: ITask = {
          title: `${task.title as string} #${this.newTaskNumber}`,
          done: false,
          order: this.newTaskOrder,
          description: task.description as string,
          userId: this.currentUserId,
        };
        this.createTask(newTask);
      }
    });
    this.subscriptions.push(subscription);
  }
}
