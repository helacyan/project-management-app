import { createAction, props } from '@ngrx/store';
import { IUserItem } from 'src/app/workspace/models/user-item.model';

const actionSource = '[Users]';

export const fetchUsers = createAction(`${actionSource} fetch`, props<{ users: IUserItem[] }>());
