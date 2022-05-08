import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { mergeMap } from 'rxjs';
import { fetchBoards } from 'src/app/store/actions/boards.actions';
import { State } from 'src/app/store/state.model';
import { IBoardItem } from 'src/app/workspace/models/board-item.model';
import { BoardsService } from '../../../api/services/boards/boards.service';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent implements OnInit {
  formValue!: {
    title: string;
  };

  public createBoardForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateBoardModalComponent>,
    private readonly boardsService: BoardsService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.createBoardForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
    });
  }

  get createBoardFormControl() {
    return this.createBoardForm.controls;
  }

  public submit() {
    if (this.createBoardForm.valid) {
      this.formValue = this.createBoardForm.value;

      this.boardsService
        .createBoard(this.formValue.title)
        .pipe(mergeMap(() => this.boardsService.getBoards()))
        .subscribe((boards: IBoardItem[]) => {
          this.store.dispatch(fetchBoards({ boards }));
        });

      this.dialogRef.close(true);
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
