import { createReducer, on } from '@ngrx/store';
import { clearColumns, disableCdkDrag, enableCdkDrag, fetchColumns, sortColumns } from '../actions/columns.actions';
import { columnsInitialState, IColumnsState } from '../state.model';
import { moveItemInArray } from '../utils/ngrx-cdk-drag-utils';

export const columnsReducer = createReducer(
  columnsInitialState,
  on(
    fetchColumns,
    (state, { columns }): IColumnsState => ({
      ...state,
      columns: columns.slice().sort((a, b) => (a.order > b.order ? 1 : -1)),
    })
  ),
  on(
    clearColumns,
    (state): IColumnsState => ({
      ...state,
      columns: [],
    })
  ),
  on(
    sortColumns,
    (state, { previousIndex, currentIndex }): IColumnsState => ({
      ...state,
      columns: moveItemInArray(state.columns, previousIndex, currentIndex),
    })
  ),
  on(
    enableCdkDrag,
    (state): IColumnsState => ({
      ...state,
      cdkDragDisabled: false,
    })
  ),
  on(
    disableCdkDrag,
    (state): IColumnsState => ({
      ...state,
      cdkDragDisabled: true,
    })
  )
);
