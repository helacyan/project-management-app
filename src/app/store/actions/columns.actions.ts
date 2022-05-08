import { createAction, props } from '@ngrx/store';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';

const actionSource = '[Columns]';

export const fetchColumns = createAction(`${actionSource} fetch`, props<{ columns: IColumnItem[] }>());

export const clearColumns = createAction(`${actionSource} clear`);
