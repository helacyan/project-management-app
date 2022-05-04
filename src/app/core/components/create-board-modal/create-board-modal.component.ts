import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BoardsService } from 'src/app/api/boards/boards.service';
import { OpenConfirmationModalService } from '../modal/services/open-modal.service';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent implements OnInit {
  formValue!: {
    title: string;
    description: string;
  };

  public createBoardForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateBoardModalComponent>,
    private readonly boardsService: BoardsService,
    private readonly openConfirmationModalService: OpenConfirmationModalService,
  ) {}

  ngOnInit(): void {
    this.createBoardForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      description: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
    });
  }

  get createBoardFormControl() {
    return this.createBoardForm.controls;
  }

  public submit() {
    if (this.createBoardForm.valid) {
      this.formValue = this.createBoardForm.value;
      this.boardsService.createBoard(this.formValue.title);
      this.openConfirmationModalService.openConfirmationDialog().forEach(res => {
        if (res === true) {
          this.boardsService.createBoard(this.formValue.title);
          this.boardsService.getBoards().forEach(boards => {
            this.store.dispatch(getBoards({ boardsResponse: boards }));
          });
        }
      });
      this.dialogRef.close(true);
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
