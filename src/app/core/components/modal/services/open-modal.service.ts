import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal.component';

@Injectable({
  providedIn: 'root',
})
export class OpenModalService {
  constructor(private dialog: MatDialog) {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '5px',
    };
    this.dialog.open(ModalComponent, dialogConfig);
  }
}
