import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUpdatedTask } from 'src/app/api/models/api.model';
import { hashSymbolValidator } from '../validators/hash.validator';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
})
export class CreateTaskModalComponent implements OnInit {
  public createTaskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public task: IUpdatedTask
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
