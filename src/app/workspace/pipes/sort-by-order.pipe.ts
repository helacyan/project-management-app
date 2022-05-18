import { Pipe, PipeTransform } from '@angular/core';
import { ITaskItem } from '../models/task-item.model';

@Pipe({
  name: 'sortByOrder',
})
export class SortByOrderPipe implements PipeTransform {
  transform<T extends ITaskItem>(items: T[] | null): T[] {
    if (items === null) return [];
    return items.slice().sort((a, b) => (a.order > b.order ? 1 : -1));
  }
}
