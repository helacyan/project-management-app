import { Component, Input, OnInit } from '@angular/core';
import { IColumnItem } from '../../models/column-item.model';
import { ITaskItem } from '../../models/task-item.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  public tasks!: ITaskItem[];

  @Input() column!: IColumnItem;

  ngOnInit(): void {
    this.tasks = this.column.tasks;
  }
}
