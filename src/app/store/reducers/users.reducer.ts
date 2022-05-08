import { createReducer, on } from '@ngrx/store';
import { fetchUsers } from '../actions/users.actions';
import { IUsersState, usersInitialState } from '../state.model';

export const usersReducer = createReducer(
  usersInitialState,
  on(
    fetchUsers,
    (state, { users }): IUsersState => ({
      ...state,
      users,
    })
  )
);
