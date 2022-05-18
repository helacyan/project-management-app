import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TITLE_ERRORS_MESSAGES } from '../consts';

@Component({
  selector: 'app-create-column-modal',
  templateUrl: './create-column-modal.component.html',
  styleUrls: ['./create-column-modal.component.scss'],
})
export class CreateColumnModalComponent implements OnInit {
  public createColumnForm!: FormGroup;

  public readonly TITLE_ERRORS_MESSAGES = TITLE_ERRORS_MESSAGES;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateColumnModalComponent>) {}

  ngOnInit(): void {
    this.createColumnForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
