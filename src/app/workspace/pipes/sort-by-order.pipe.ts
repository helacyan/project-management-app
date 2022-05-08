import { Pipe, PipeTransform } from '@angular/core';
import { IColumnItem } from '../models/column-item.model';
import { ITaskItem } from '../models/task-item.model';

@Pipe({
  name: 'sortByOrder',
})
export class SortByOrderPipe implements PipeTransform {
  transform<T extends IColumnItem | ITaskItem>(items: T[] | null): T[] {
    if (items === null) return [];
    return items.slice().sort((a, b) => (a.order > b.order ? 1 : -1));
  }
}
