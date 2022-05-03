import { Component, Input } from '@angular/core';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { IBoardItem } from '../../models/board-item.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board!: IBoardItem;

  constructor(
    private readonly openConfirmationModalService: OpenConfirmationModalService,
    private readonly boardsService: BoardsService
  ) {}

  public openModal() {
    this.openConfirmationModalService.openConfirmationDialog().forEach(res => console.log(res));
  }

  public deleteBoard() {
    this.openConfirmationModalService.openConfirmationDialog().forEach(res => {
      if (res) {
        this.boardsService.deleteBoard(this.board.id);
      }
    });
  }
}
