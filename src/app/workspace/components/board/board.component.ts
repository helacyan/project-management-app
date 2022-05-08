import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap } from 'rxjs';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';
import { fetchBoards } from 'src/app/store/actions/boards.actions';
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
    private store: Store<State>,
    private router: Router
  ) {}

  public openModal() {
    this.openConfirmationModalService.openConfirmationDialog().forEach(res => console.log(res));
  }

  public openBoard() {
    this.router.navigate(['/board/', this.board.id]);
  }

  public deleteBoard() {
    this.openConfirmationModalService.openConfirmationDialog().forEach(res => {
      if (res === true) {
        this.boardsService
          .deleteBoard(this.board.id)
          .pipe(mergeMap(() => this.boardsService.getBoards()))
          .subscribe((boards: IBoardItem[]) => {
            this.store.dispatch(fetchBoards({ boards }));
          });
      }
    });
  }
}
