import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { getBoards } from 'src/app/store/actions/getBoards.action';
import { State } from 'src/app/store/state.model';
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
    private readonly boardsService: BoardsService,
    private store: Store<State>
  ) {}

  public openModal() {
    this.openConfirmationModalService.openConfirmationDialog().forEach(res => console.log(res));
  }

  public deleteBoard() {
    this.openConfirmationModalService.openConfirmationDialog().forEach(res => {
      if (res === true) {
        this.boardsService.deleteBoard(this.board.id);
        this.boardsService.getBoards().forEach(boards => {
          this.store.dispatch(getBoards({ boardsResponse: boards }));
        });
      }
    });
  }
}
