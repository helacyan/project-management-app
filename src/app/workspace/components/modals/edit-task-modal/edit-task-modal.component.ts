import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IUpdateTask } from 'src/app/api/models/api.model';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { selectColumn } from 'src/app/store/selectors/columns.selectors';
import { selectUsers } from 'src/app/store/selectors/users.selectors';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';
import { ITaskItemExtended } from 'src/app/workspace/models/task-item.model';
import { IUserItem } from 'src/app/workspace/models/user-item.model';
import { DESCRIPTION_ERRORS_MESSAGES, TITLE_ERRORS_MESSAGES } from '../consts';
import { hashSymbolValidator } from '../validators/hash.validator';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss'],
})
export class EditTaskModalComponent implements OnInit, OnDestroy {
  private column$!: Observable<IColumnItem | undefined>;

  public columnTitle!: string | undefined;

  public users$!: Observable<IUserItem[]>;

  public taskNumber!: string;

  public editTitleForm!: FormGroup;

  public editDescriptionForm!: FormGroup;

  public editUserIdForm!: FormGroup;

  public editDoneForm!: FormGroup;

  public isTitleEnabled$ = new BehaviorSubject<boolean>(false);

  public isTitleDisabled$ = new BehaviorSubject<boolean>(true);

  public isDescriptionEnabled$ = new BehaviorSubject<boolean>(false);

  public isDescriptionDisabled$ = new BehaviorSubject<boolean>(true);

  public readonly TITLE_ERRORS_MESSAGES = TITLE_ERRORS_MESSAGES;

  public readonly DESCRIPTION_ERRORS_MESSAGES = DESCRIPTION_ERRORS_MESSAGES;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private tasksService: TasksService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITaskItemExtended
  ) {}

  ngOnInit(): void {
    this.column$ = this.store.select(selectColumn(this.data.columnId));
    this.setColumnName();
    this.users$ = this.store.select(selectUsers);
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
}
