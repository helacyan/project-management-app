import { IBoardItem } from 'src/app/workspace/models/board-item.model';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';
import { IUserItem } from '../workspace/models/user-item.model';

export interface State {
  usersState: IUsersState;
  boardsState: IBoardsState;
  columnsState: IColumnsState;
}

export interface IUsersState {
  currentUserId: string;
  users: IUserItem[];
}

export interface IBoardsState {
  boards: IBoardItem[];
}

export interface IColumnsState {
  columns: IColumnItem[];
}

export const usersInitialState: IUsersState = {
  currentUserId: '',
  users: [],
};

export const boardsInitialState: IBoardsState = {
  boards: [],
};

export const columnsInitialState: IColumnsState = {
  columns: [],
};

export const initialState: State = {
  usersState: usersInitialState,
  boardsState: boardsInitialState,
  columnsState: columnsInitialState,
};
