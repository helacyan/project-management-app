export interface IUser {
  id?: string;
  name: string;
  login: string;
  password?: string;
}

export interface IRegistered {
  id: string;
  login: string;
  name: string;
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

export interface IUpdateTask extends ITask {
  boardId: string;
  columnId: string;
}
