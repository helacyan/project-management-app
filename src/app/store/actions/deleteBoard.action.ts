import { createAction, props } from '@ngrx/store';
import { IBoardItem } from 'src/app/workspace/models/board-item.model';

export const deleteBoard = createAction('[MAIN PAGE] DELETE BOARD ', props<{ board: IBoardItem }>());
