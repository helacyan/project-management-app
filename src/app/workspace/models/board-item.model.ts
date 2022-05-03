export interface IBoardItem {
  id: string;
  title: string;
  columns: Array<IColumn>;
}

interface IColumn {
  id: string;
  title: string;
  order: number;
  tasks: Array<ITask>;
}

interface ITask {
  id: string;
  title: string;
  order: number;
  done: boolean;
  description: string;
  userId: string;
  files: [
    {
      filename: string;
      fileSize: number;
    }
  ];
}
