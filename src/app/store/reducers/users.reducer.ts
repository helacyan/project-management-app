import { createReducer, on } from '@ngrx/store';
import { fetchUsers, setCurrentUserId } from '../actions/users.actions';
import { IUsersState, usersInitialState } from '../state.model';

export const usersReducer = createReducer(
  usersInitialState,
  on(
    fetchUsers,
    (state, { users }): IUsersState => ({
      ...state,
      users,
    })
  ),
  on(
    setCurrentUserId,
    (state, { currentUserId }): IUsersState => ({
      ...state,
      currentUserId,
    })
  )
);
