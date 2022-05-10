import { createReducer, on } from '@ngrx/store';
import { clearBoards, fetchBoards } from '../actions/boards.actions';
import { boardsInitialState, IBoardsState } from '../state.model';

export const boardsReducer = createReducer(
  boardsInitialState,
  on(
    fetchBoards,
    (state, { boards }): IBoardsState => ({
      ...state,
      boards,
    })
  ),
  on(
    clearBoards,
    (state): IBoardsState => ({
      ...state,
      boards: [],
    })
  )
);
