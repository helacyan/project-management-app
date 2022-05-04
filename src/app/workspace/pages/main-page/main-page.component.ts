import { Component, OnInit } from '@angular/core';
import { IBoardItem } from '../../models/board-item.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/store/state.model';
import { getStoreBoards } from '../../../store/selectors/getStoreBoards.selector';
import { getBoards } from 'src/app/store/actions/getBoards.action';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  boardList!: Array<IBoardItem>;

  constructor(private readonly boardsService: BoardsService, private store: Store<State>) {}

  ngOnInit(): void {
    this.store.pipe(select(getStoreBoards)).subscribe(boards => (this.boardList = boards));
    this.boardsService.getBoards().forEach(boards => {
      this.boardList = boards;
      this.store.dispatch(getBoards({ boardsResponse: boards }));
    });
  }
}
