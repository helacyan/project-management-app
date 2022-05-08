import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUsersState } from '../state.model';

const selectUsersState = createFeatureSelector<IUsersState>('usersState');

export const selectUsers = createSelector(selectUsersState, state => state.users);

export const selectCurrentUser = (login: string) =>
  createSelector(selectUsersState, state => state.users.find(item => item.login === login));
