import { Component, OnInit } from '@angular/core';
import { IBoardItem } from '../../models/board-item.model';
import boards from '../../mocks/board-list.mock';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  boardList!: Array<IBoardItem>;

  ngOnInit(): void {
    this.boardList = boards;
  }
}
