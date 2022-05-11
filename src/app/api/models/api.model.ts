export interface IUser {
  name: string;
  login: string;
  password: string;
}

export type LoginType = Omit<IUser, 'name'>;

export interface IColumn {
  title: string;
  order: number;
}

export interface ITask {
  title: string;
  done: boolean;
  order: number;
  description: string;
  userId: string;
}

export interface IUpdatedTask extends ITask {
  boardId: string;
  columnId: string;
}
