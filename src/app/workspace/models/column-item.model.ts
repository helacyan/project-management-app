import { IColumn } from './board-item.model';
import { ITaskItem } from './task-item.model';

export interface IColumnItem extends IColumn {
  id: string;
  tasks: ITaskItem[];
}
