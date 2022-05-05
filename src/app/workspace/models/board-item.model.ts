import { ITaskItem } from './task-item.model';

export interface IBoardItem {
  id: string;
  title: string;
  columns: Array<IColumn>;
}

export interface IColumn {
  id: string;
  title: string;
  order: number;
  tasks: Array<ITaskItem>;
}
