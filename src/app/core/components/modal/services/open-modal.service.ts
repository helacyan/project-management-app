import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal.component';

@Injectable({
  providedIn: 'root',
})
export class OpenConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  openConfirmationDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: 'calc(70px + 2rem)',
    };
    return this.dialog.open(ModalComponent, dialogConfig).afterClosed();
  }
}
