import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, concat, EMPTY, mergeMap, Observable, Subscription } from 'rxjs';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { FilesService } from 'src/app/api/services/files/files.service';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { loadColumns } from 'src/app/store/actions/columns.actions';
import { selectCurrentUserId } from 'src/app/store/selectors/users.selectors';
import { IBoardItem } from '../../models/board-item.model';
import { ITaskItem } from '../../models/task-item.model';
import { EditTaskModalComponent } from '../modals/edit-task-modal/edit-task-modal.component';
import { IFileItem } from '../../models/file-item.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  public title!: string;

  public order!: number;

  public description!: string;

  public executor!: string;

  public done!: boolean;

  public isTaskOwnByCurrentUser$!: BehaviorSubject<boolean>;

  private files: IFileItem[] = [];

  private index: number = 0;

  private subscriptions: Subscription[] = [];

  @Input() task!: ITaskItem;

  @Input() columnId!: string;

  @Input() boardId!: string;

  constructor(
    private store: Store,
    private usersService: UsersService,
    private boardsService: BoardsService,
    private tasksService: TasksService,
    private filesService: FilesService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private readonly openConfirmationModalService: OpenConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.title = this.task.title;
    this.description = this.task.description;
    this.fetchExecutor();
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

  private fetchExtraOptions = (): void => {
    const subscription = this.tasksService.getTaskById(this.boardId, this.columnId, this.task.id).subscribe(task => {
      this.description = task.description;
      this.done = task.done;
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
    this.store.dispatch(loadColumns({ columns: board.columns || [] }));

  private deleteTask = (): void => {
    const subscription = this.tasksService
      .deleteTask(this.boardId, this.columnId, this.task.id)
      .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
      .subscribe((board: IBoardItem) => this.updateColumnsState(board));

    this.subscriptions.push(subscription);
  };

  public onDeleteButtonClick($event: MouseEvent) {
    $event.stopPropagation();
    const subscription = this.openConfirmationModalService.openConfirmationDialog().subscribe(res => {
      if (res === true) {
        this.deleteTask();
      }
    });

    this.subscriptions.push(subscription);
  }

  private getFilesRequests = (task: ITaskItem): Observable<Blob>[] => {
    const requests: Observable<Blob>[] = [];
    if (task.files && task.files.length) {
      task.files.forEach(file => {
        const request$ = this.filesService.downloadFile(this.task.id, file.filename).pipe(
          catchError(() => {
            this.files.push({ filename: file.filename, fileSize: 0, fileUrl: '' });
            this.index++;
            return EMPTY;
          })
        );
        requests.push(request$);
      });
      return requests;
    } else {
      return [];
    }
  };

  public openEditTaskDialog(): void {
    const subscription = this.tasksService.getTaskById(this.boardId, this.columnId, this.task.id).subscribe(task => {
      const openSubscription = concat(...this.getFilesRequests(task)).subscribe({
        next: blob => {
          if (task.files) {
            if (blob) {
              let objectURL = URL.createObjectURL(blob);
              const fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.files.push({ ...task.files[this.index], fileUrl });
              this.index++;
            }
          }
        },
        complete: () => {
          const dialogRef = this.dialog.open(EditTaskModalComponent, {
            maxWidth: '95vw !important',
            data: {
              id: task.id,
              title: task.title,
              order: task.order,
              description: task.description,
              userId: task.userId,
              done: task.done,
              files: this.files,
              boardId: task.boardId,
              columnId: task.columnId,
            },
          });

          const closeSubscription = dialogRef
            .afterClosed()
            .pipe(mergeMap(() => this.boardsService.getBoardById(this.boardId)))
            .subscribe((board: IBoardItem) => {
              this.store.dispatch(loadColumns({ columns: board.columns || [] }));
              this.tasksService.getTaskById(this.boardId, this.columnId, this.task.id).subscribe(taskItem => {
                this.task = taskItem;
                this.fetchExecutor();
                this.fetchExtraOptions();
              });
            });

          this.subscriptions.push(closeSubscription);
        },
      });
      this.subscriptions.push(openSubscription);
    });

    this.subscriptions.push(subscription);
  }
}
