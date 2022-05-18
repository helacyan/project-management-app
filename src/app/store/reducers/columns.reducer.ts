import { createReducer, on } from '@ngrx/store';
import {
  addColumn,
  clearColumns,
  disableCdkDrag,
  enableCdkDrag,
  loadColumns,
  moveColumns,
  replaceColumn,
} from '../actions/columns.actions';
import { columnsInitialState, IColumnsState } from '../state.model';
import { moveItemInArray } from '../utils/ngrx-cdk-drag-utils';

export const columnsReducer = createReducer(
  columnsInitialState,
  on(
    loadColumns,
    (state, { columns }): IColumnsState => ({
      ...state,
      columns: columns.slice().sort((a, b) => (a.order > b.order ? 1 : -1)),
    })
  ),
  on(
    addColumn,
    (state, { column }): IColumnsState => ({
      ...state,
      columns: [...state.columns, column],
    })
  ),
  on(
    replaceColumn,
    (state, { columnIndex, updatedColumn }): IColumnsState => ({
      ...state,
      columns: [...state.columns.slice(0, columnIndex), updatedColumn, ...state.columns.slice(columnIndex + 1)],
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
    moveColumns,
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
