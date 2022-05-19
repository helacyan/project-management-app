import { ITask, IUpdateTask } from 'src/app/api/models/api.model';
import { IFileItem } from './file-item.model';

export interface ITaskItem extends ITask {
  id: string;
  files?: IFileItem[];
}

export interface ITaskItemExtended extends ITaskItem, IUpdateTask {}

export interface INewTaskDialogData extends Pick<ITaskItemExtended, 'order' | 'userId' | 'boardId' | 'columnId'> {
  number: number;
}
