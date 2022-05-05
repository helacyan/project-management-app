import { IBoardItem } from '../workspace/models/board-item.model';

export interface State {
  boards: IBoardsState;
}
export interface IBoardsState {
  boards: IBoardItem[];
}
export const boardsInitialState: IBoardsState = {
  boards: [],
};
export const initialState: State = {
  boards: boardsInitialState,
};
