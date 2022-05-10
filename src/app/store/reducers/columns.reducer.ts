import { createReducer, on } from '@ngrx/store';
import { clearColumns, fetchColumns } from '../actions/columns.actions';
import { columnsInitialState, IColumnsState } from '../state.model';

export const columnsReducer = createReducer(
  columnsInitialState,
  on(
    fetchColumns,
    (state, { columns }): IColumnsState => ({
      ...state,
      columns,
    })
  ),
  on(
    clearColumns,
    (state): IColumnsState => ({
      ...state,
      columns: [],
    })
  )
);
