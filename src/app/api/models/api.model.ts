export interface IUser {
  name: string;
  login: string;
  password: string;
}

export interface ILogin {
  login: string;
  password: string;
}

export interface IColumn {
  title: string;
  order: number;
}

export interface ITask {
  title: string;
  order: number;
  description: string;
  userId: string;
}

export interface IUpdateTask {
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  order: number;
  userId: string;
}
