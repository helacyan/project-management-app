import { IUpdatedTask } from 'src/app/api/models/api.model';
import { IFileItem } from './file-item.model';

export interface ITaskItem extends IUpdatedTask {
  id: string;
  files: IFileItem[];
}
