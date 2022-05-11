import { createAction, props } from '@ngrx/store';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';

const actionSource = '[COLUMNS]';

export const fetchColumns = createAction(`${actionSource} FETCH`, props<{ columns: IColumnItem[] }>());

export const clearColumns = createAction(`${actionSource} CLEAR`);
