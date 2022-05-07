import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IColumnItem } from '../../models/column-item.model';
import { ITaskItem } from '../../models/task-item.model';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent {
  public tasks$!: Observable<ITaskItem[]>;

  @Input() column!: IColumnItem;
}
