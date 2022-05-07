import { IBoardItem } from 'src/app/workspace/models/board-item.model';
import { IColumnItem } from 'src/app/workspace/models/column-item.model';

export interface State {
  boardsState: IBoardsState;
  columnsState: IColumnsState;
}

export interface IBoardsState {
  boards: IBoardItem[];
}

export interface IColumnsState {
  columns: IColumnItem[];
}

export const boardsInitialState: IBoardsState = {
  boards: [],
};

export const columnsInitialState: IColumnsState = {
  columns: [],
};

export const initialState: State = {
  boardsState: boardsInitialState,
  columnsState: columnsInitialState,
};
