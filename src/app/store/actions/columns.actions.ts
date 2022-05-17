import { createAction, props } from '@ngrx/store';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';

const actionSource = '[BOARD-PAGE]';

export const fetchColumns = createAction(`${actionSource} FETCH COLUMNS`, props<{ columns: IColumnItem[] }>());

export const addColumn = createAction(`${actionSource} ADD COLUMN`, props<{ column: IColumnItem }>());

export const clearColumns = createAction(`${actionSource} CLEAR COLUMNS`);

export const moveColumns = createAction(
  `${actionSource} MOVE COLUMNS`,
  props<{ previousIndex: number; currentIndex: number }>()
);

export const enableCdkDrag = createAction(`${actionSource} ENABLE CDK DRAG`);

export const disableCdkDrag = createAction(`${actionSource} DISABLE CDK DRAG`);
