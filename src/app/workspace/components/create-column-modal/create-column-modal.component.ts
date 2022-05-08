import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-column-modal',
  templateUrl: './create-column-modal.component.html',
  styleUrls: ['./create-column-modal.component.scss'],
})
export class CreateColumnModalComponent implements OnInit {
  public createColumnForm!: FormGroup;

  public readonly TITLE_ERRORS_MESSAGES = {
    required: 'Пожалуйста, введите название',
    minLength: 'Название слишком короткое',
    maxLength: 'Название слишком длинное',
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateColumnModalComponent>,
    @Inject(MAT_DIALOG_DATA) public title: string
  ) {}

  ngOnInit(): void {
    this.createColumnForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
