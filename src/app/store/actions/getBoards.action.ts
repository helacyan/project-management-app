import { createAction, props } from '@ngrx/store';
import { IBoardItem } from 'src/app/workspace/models/board-item.model';

export const getBoards = createAction('[MAIN PAGE] GET BOARDS SUCCESS', props<{ boardsResponse: IBoardItem[] }>());
