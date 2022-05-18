import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUsersState } from '../state.model';

const selectUsersState = createFeatureSelector<IUsersState>('usersState');

export const selectUsers = createSelector(selectUsersState, state => state.users);

export const selectCurrentUserId = createSelector(selectUsersState, state => state.currentUserId);

export const selectUser = (userId: string) =>
  createSelector(selectUsersState, state => state.users.find(user => user.id === userId));
