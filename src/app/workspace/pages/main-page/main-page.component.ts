import { Component, OnInit } from '@angular/core';
import { IBoardItem } from '../../models/board-item.model';
import { BoardsService } from 'src/app/api/services/boards/boards.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  boardList!: Array<IBoardItem>;

  constructor(private readonly boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boardsService.getBoards().forEach(boards => (this.boardList = boards));
  }
}
