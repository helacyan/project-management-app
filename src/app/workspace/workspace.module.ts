import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RouterModule } from '@angular/router';
import SharedModule from 'src/app/shared/shared.module';
import { BoardPageComponent } from './pages/board-page/board-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ColumnComponent } from './components/column/column.component';
import { CreateColumnModalComponent } from './components/modals/create-column-modal/create-column-modal.component';
import { TaskComponent } from './components/task/task.component';
import { AuthGuardService } from '../auth/guards/auth-guard.service';
import { SortByOrderPipe } from './pipes/sort-by-order.pipe';
import { CreateTaskModalComponent } from './components/modals/create-task-modal/create-task-modal.component';
import { MatCardBackgroundColorDirective } from './directives/mat-card-background-color.directive';
import { CursorMoveDirective } from './directives/cursor-move.directive';
import { EditTaskModalComponent } from './components/modals/edit-task-modal/edit-task-modal.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { MatCardTransformDirective } from './directives/mat-card-transform.directive';

@NgModule({
  declarations: [
    MainPageComponent,
    BoardPageComponent,
    BoardComponent,
    SearchPageComponent,
    ColumnComponent,
    CreateColumnModalComponent,
    TaskComponent,
    SortByOrderPipe,
    CreateTaskModalComponent,
    MatCardBackgroundColorDirective,
    CursorMoveDirective,
    EditTaskModalComponent,
    ClickOutsideDirective,
    MatCardTransformDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainPageComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'board/:id',
        component: BoardPageComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'search',
        component: SearchPageComponent,
        canActivate: [AuthGuardService],
      },
    ]),
  ],
})
export class WorkspaceModule {}
