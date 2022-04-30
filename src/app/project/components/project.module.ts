import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board.component';
import { TaskComponent } from './task/task.component';
import { TaskDetailedComponent } from './task-detailed/task-detailed.component';
import { SearchComponent } from './search/search.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import SharedModule from 'src/app/shared.module';

@NgModule({
  declarations: [
    BoardComponent,
    TaskComponent,
    TaskDetailedComponent,
    SearchComponent,
    MainComponent,
    ErrorPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: 'board/:id',
        component: BoardComponent,
      },
      {
        path: 'task/:id',
        component: TaskDetailedComponent,
      },
      {
        path: 'error',
        component: ErrorPageComponent,
      },
      {
        path: '**',
        redirectTo: '/error',
      },
    ]),
  ],
})
export class ProjectModule {}
