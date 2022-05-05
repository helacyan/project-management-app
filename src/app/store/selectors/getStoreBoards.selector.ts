import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IBoardsState } from '../state.model';

export const getState = createFeatureSelector<IBoardsState>('boards');

export const getStoreBoards = createSelector(getState, (state: IBoardsState) => state.boards);
