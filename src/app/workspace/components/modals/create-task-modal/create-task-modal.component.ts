import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ITask } from 'src/app/api/models/api.model';
import { TasksService } from 'src/app/api/services/tasks/tasks.service';
import { INewTaskDialogData } from 'src/app/workspace/models/task-item.model';
import { DESCRIPTION_ERRORS_MESSAGES, TITLE_ERRORS_MESSAGES } from '../consts';
import { hashSymbolValidator } from '../validators/hash.validator';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
})
export class CreateTaskModalComponent implements OnInit {
  public createTaskForm!: FormGroup;

  public readonly TITLE_ERRORS_MESSAGES = TITLE_ERRORS_MESSAGES;

  public readonly DESCRIPTION_ERRORS_MESSAGES = DESCRIPTION_ERRORS_MESSAGES;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    public dialogRef: MatDialogRef<CreateTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: INewTaskDialogData
  ) {}

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20), hashSymbolValidator()]],
      description: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public createTask = (): void => {
    const newTask: ITask = {
      title: `${this.createTaskForm.controls.title.value} #${this.data.number}`,
      done: false,
      order: this.data.order,
      description: this.createTaskForm.controls.description.value,
      userId: this.data.userId,
    };

    const subscription = this.tasksService
      .createTask(this.data.boardId, this.data.columnId, newTask)
      .subscribe(() => this.dialogRef.close());

    this.subscriptions.push(subscription);
  };
}
