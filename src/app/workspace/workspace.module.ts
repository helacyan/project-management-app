import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RouterModule } from '@angular/router';
import SharedModule from 'src/app/shared/shared.module';
import { BoardPageComponent } from './pages/board-page/board-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ColumnComponent } from './components/column/column.component';
import { CreateColumnModalComponent } from './components/create-column-modal/create-column-modal.component';
import { TaskComponent } from './components/task/task.component';

@NgModule({
  declarations: [
    MainPageComponent,
    BoardPageComponent,
    BoardComponent,
    SearchPageComponent,
    ColumnComponent,
    CreateColumnModalComponent,
    TaskComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainPageComponent,
      },
      {
        path: 'board/:id',
        component: BoardPageComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
    ]),
  ],
})
export class WorkspaceModule {}
