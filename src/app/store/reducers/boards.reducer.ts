import { createReducer, on } from '@ngrx/store';
import { getBoards } from '../actions/getBoards.action';
import { boardsInitialState } from '../state.model';

export const boardsReducer = createReducer(
  boardsInitialState,
  on(getBoards, (state, { boardsResponse }) => ({
    ...state,
    boards: [...boardsResponse],
  }))
);
