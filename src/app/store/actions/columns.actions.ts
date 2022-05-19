import { createAction, props } from '@ngrx/store';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';

const actionSource = '[BOARD-PAGE]';

export const loadColumns = createAction(`${actionSource} LOAD COLUMNS`, props<{ columns: IColumnItem[] }>());

export const addColumn = createAction(`${actionSource} ADD COLUMN`, props<{ column: IColumnItem }>());

export const replaceColumn = createAction(
  `${actionSource} REPLACE COLUMN`,
  props<{ columnIndex: number; updatedColumn: IColumnItem }>()
);

export const clearColumns = createAction(`${actionSource} CLEAR COLUMNS`);

export const moveColumns = createAction(
  `${actionSource} MOVE COLUMNS`,
  props<{ previousIndex: number; currentIndex: number }>()
);

export const enableCdkDrag = createAction(`${actionSource} ENABLE CDK DRAG`);

export const disableCdkDrag = createAction(`${actionSource} DISABLE CDK DRAG`);
