import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITask } from 'src/app/api/models/api.model';
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Pick<ITask, 'title' | 'description'>
  ) {}

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20), hashSymbolValidator()]],
      description: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
