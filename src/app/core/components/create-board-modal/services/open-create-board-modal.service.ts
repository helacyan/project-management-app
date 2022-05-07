import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateBoardModalComponent } from '../create-board-modal.component';

@Injectable({
  providedIn: 'root',
})
export class OpenCreateBoardModalService {
  constructor(private dialog: MatDialog) {}

  openCreateBoardDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '30px',
    };
    return this.dialog.open(CreateBoardModalComponent, dialogConfig).afterClosed();
  }
}
