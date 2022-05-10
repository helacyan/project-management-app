import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap, Subscription } from 'rxjs';
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
export class BoardComponent implements OnDestroy {
  @Input() board!: IBoardItem;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly openConfirmationModalService: OpenConfirmationModalService,
    private readonly boardsService: BoardsService,
    private store: Store<State>,
    private router: Router
  ) {}
  public openBoard() {
    this.router.navigate(['/board/', this.board.id]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  public deleteBoard() {
    const subscription = this.openConfirmationModalService.openConfirmationDialog().subscribe({
      next: res => {
        if (res === true) {
          this.boardsService
            .deleteBoard(this.board.id)
            .pipe(mergeMap(() => this.boardsService.getBoards()))
            .subscribe((boards: IBoardItem[]) => {
              this.store.dispatch(fetchBoards({ boards }));
            });
        }
      },
      error: er => {
        console.log(er);
      },
    });
    this.subscriptions.push(subscription);
  }
}
