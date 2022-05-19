import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IUpdateTask } from 'src/app/api/models/api.model';
import { FilesService } from 'src/app/api/services/files/files.service';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { UsersService } from 'src/app/api/services/users/users.service';
import { selectColumn } from 'src/app/store/selectors/columns.selectors';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';
import { ITaskItemExtended } from 'src/app/workspace/models/task-item.model';
import { IUserItem } from 'src/app/workspace/models/user-item.model';
import { hashSymbolValidator } from '../validators/hash.validator';
import { DomSanitizer } from '@angular/platform-browser';
import { IFileItem } from 'src/app/workspace/models/file-item.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss'],
})
export class EditTaskModalComponent implements OnInit, OnDestroy {
  private column$!: Observable<IColumnItem | undefined>;

  public columnTitle!: string | undefined;

  public users!: IUserItem[];

  public taskNumber!: string;

  public editTitleForm!: FormGroup;

  public editDescriptionForm!: FormGroup;

  public editUserIdForm!: FormGroup;

  public editDoneForm!: FormGroup;

  public isTitleEnabled$ = new BehaviorSubject<boolean>(false);

  public isTitleDisabled$ = new BehaviorSubject<boolean>(true);

  public isDescriptionEnabled$ = new BehaviorSubject<boolean>(false);

  public isDescriptionDisabled$ = new BehaviorSubject<boolean>(true);

  public fileName$ = new BehaviorSubject<string>('Загрузить файл');

  public fileToUpload: File | null = null;

  public files$!: BehaviorSubject<IFileItem[]>;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private tasksService: TasksService,
    private filesService: FilesService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private userService: UsersService,
    public dialogRef: MatDialogRef<EditTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITaskItemExtended
  ) {
    this.userService.getUsers().subscribe(users => (this.users = users));
  }

  ngOnInit(): void {
    this.column$ = this.store.select(selectColumn(this.data.columnId));
    this.setColumnName();
    this.taskNumber = this.data.title.slice(this.data.title.indexOf('#') - 1);
    this.editTitleForm = this.fb.group({
      title: [
        this.data.title.slice(0, this.data.title.indexOf('#') - 1),
        [Validators.required, Validators.minLength(3), Validators.maxLength(20), hashSymbolValidator()],
      ],
    });
    this.editDescriptionForm = this.fb.group({
      description: [this.data.description, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
    this.editUserIdForm = this.fb.group({
      userId: [this.data.userId],
    });
    this.editDoneForm = this.fb.group({
      done: [this.data.done],
    });
    this.files$ = new BehaviorSubject<IFileItem[]>(this.data.files || []);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setColumnName = (): void => {
    const subscription = this.column$.subscribe(column => (this.columnTitle = column?.title));
    this.subscriptions.push(subscription);
  };

  public enableEditMode = (
    $event: MouseEvent,
    isEnabled$: BehaviorSubject<boolean>,
    isDisabled$: BehaviorSubject<boolean>
  ): void => {
    $event.stopPropagation();
    this.editTitleForm.controls.title.setValue(this.data.title.slice(0, this.data.title.indexOf('#') - 1));
    this.editDescriptionForm.controls.description.setValue(this.data.description);

    this.disableAllEditModes();
    isEnabled$.next(true);
    isDisabled$.next(false);
  };

  private disableEditMode = (isEnabled$: BehaviorSubject<boolean>, isDisabled$: BehaviorSubject<boolean>): void => {
    isEnabled$.next(false);
    isDisabled$.next(true);
  };

  public disableAllEditModes = (): void => {
    this.disableEditMode(this.isTitleEnabled$, this.isTitleDisabled$);
    this.disableEditMode(this.isDescriptionEnabled$, this.isDescriptionDisabled$);
  };

  public onTitleEditSubmit = (): void => {
    this.data.title = `${this.editTitleForm.controls.title.value} #${this.taskNumber}`;
    this.disableEditMode(this.isTitleEnabled$, this.isTitleDisabled$);
    this.updateTask();
  };

  public onTitleEditCancel = (): void => {
    this.editTitleForm.controls.title.setValue(this.data.title.slice(0, this.data.title.indexOf('#') - 1));
    this.disableEditMode(this.isTitleEnabled$, this.isTitleDisabled$);
  };

  public onDescriptionEditSubmit = (): void => {
    this.data.description = this.editDescriptionForm.controls.description.value;
    this.disableEditMode(this.isDescriptionEnabled$, this.isDescriptionDisabled$);
    this.updateTask();
  };

  public onDescriptionEditCancel = (): void => {
    this.editDescriptionForm.controls.description.setValue(this.data.description);
    this.disableEditMode(this.isDescriptionEnabled$, this.isDescriptionDisabled$);
  };

  public onSelectChange = (userId: string): void => {
    this.data.userId = userId;
    this.updateTask();
  };

  public updateTask = (): void => {
    const updatedTask: IUpdateTask = {
      title: `${this.editTitleForm.controls.title.value}${this.taskNumber}`,
      done: this.editDoneForm.controls.done.value,
      order: this.data.order,
      description: this.editDescriptionForm.controls.description.value,
      userId: this.data.userId,
      boardId: this.data.boardId,
      columnId: this.data.columnId,
    };
    const subscription = this.tasksService
      .updateTask(this.data.boardId, this.data.columnId, this.data.id, updatedTask)
      .subscribe();

    this.subscriptions.push(subscription);
  };

  public onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName$.next(file.name);

      const subscription = this.filesService.uploadFile(file, this.data.id).subscribe({
        error: error => {
          if (error !== 'File already exists!') {
            const completeSubscription = this.filesService.downloadFile(this.data.id, file.name).subscribe({
              next: blob => {
                if (blob) {
                  let objectURL = URL.createObjectURL(blob);
                  const fileUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                  const newFile: IFileItem = {
                    filename: file.name,
                    fileSize: blob.size,
                    fileUrl,
                  };
                  this.files$.next([...this.files$.value, newFile]);
                  this.fileName$.next('Загрузить файл');
                }
              },
              error: () => {
                const newFile: IFileItem = {
                  filename: file.name,
                  fileSize: 0,
                  fileUrl: '',
                };
                this.files$.next([...this.files$.value, newFile]);
              },
            });
            this.subscriptions.push(completeSubscription);
          }
        },
      });

      this.subscriptions.push(subscription);
    }
  }

  public onDownloadFile = (filename: string): void => {
    const subscription = this.filesService
      .downloadFile(this.data.id, filename)
      .subscribe(blob => saveAs(blob, filename));

    this.subscriptions.push(subscription);
  };
}
