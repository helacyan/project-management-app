import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IBoardsState } from '../state.model';

export const getState = createFeatureSelector<IBoardsState>('boardsState');

export const getStoreBoards = createSelector(getState, (state: IBoardsState) => state.boards);
