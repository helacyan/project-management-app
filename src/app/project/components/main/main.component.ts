import { Component } from '@angular/core';
import { IBoardItem } from './board-item.module';
import boards from './board-list.module';
import { OpenConfirmationModalService } from 'src/app/core/components/modal/services/open-modal.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  boardList!: Array<IBoardItem>;

  constructor(private readonly openConfirmationModalService: OpenConfirmationModalService) {
    this.boardList = boards;
  }

  openModal() {
    this.openConfirmationModalService.openConfirmationDialog().forEach(res => console.log(res));
  }
}
