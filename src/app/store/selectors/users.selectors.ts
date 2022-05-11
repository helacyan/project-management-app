import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUsersState } from '../state.model';

const selectUsersState = createFeatureSelector<IUsersState>('usersState');

export const selectUsers = createSelector(selectUsersState, state => state.users);

export const selectCurrentUser = (login: string) =>
  createSelector(selectUsersState, state => {
    const currentUser = state.users.find(user => user.login === login);
    return currentUser?.id;
  });

export const selectUser = (userId: string) =>
  createSelector(selectUsersState, state => state.users.find(user => user.id === userId));
