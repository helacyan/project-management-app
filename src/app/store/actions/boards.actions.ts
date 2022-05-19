import { createAction, props } from '@ngrx/store';
import { IBoardItem } from 'src/app/workspace/models/board-item.model';

export const fetchBoards = createAction('[MAIN PAGE] GET BOARDS SUCCESS', props<{ boards: IBoardItem[] }>());
