import { IColumnItem } from './column-item.model';

export interface IBoardItem {
  title: string;
  id: string;
  columns?: IColumnItem[];
}
