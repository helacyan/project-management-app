import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IColumnsState } from '../state.model';

const selectColumnsState = createFeatureSelector<IColumnsState>('columnsState');

export const selectColumns = createSelector(selectColumnsState, state => state.columns);

export const selectCdkDragDisabled = createSelector(selectColumnsState, state => state.cdkDragDisabled);
