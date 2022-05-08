import { IColumnItem } from './column-item.model';

export interface IBoardItem {
  id: string;
  title: string;
  columns?: IColumnItem[];
}
