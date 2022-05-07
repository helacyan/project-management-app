import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IColumnsState } from '../state.model';

const selectFeature = createFeatureSelector<IColumnsState>('columnsState');

export const selectColumns = createSelector(selectFeature, state => state.columns);
