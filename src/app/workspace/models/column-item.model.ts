import { IColumn } from 'src/app/api/models/api.model';
import { ITaskItem } from './task-item.model';

export interface IColumnItem extends IColumn {
  id: string;
  tasks: ITaskItem[];
}
