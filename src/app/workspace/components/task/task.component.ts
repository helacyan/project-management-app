import { Component, Input } from '@angular/core';
import { ITaskItem } from '../../models/task-item.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: ITaskItem;
}
