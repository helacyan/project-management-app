import { createAction, props } from '@ngrx/store';
import { IUserItem } from 'src/app/workspace/models/user-item.model';

const actionSource = '[USERS]';

export const fetchUsers = createAction(`${actionSource} FETCH`, props<{ users: IUserItem[] }>());

export const setCurrentUserId = createAction(`${actionSource} SET CURRENT USER ID`, props<{ currentUserId: string }>());
