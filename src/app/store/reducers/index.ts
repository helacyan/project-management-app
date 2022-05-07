import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { State } from '../state.model';
import { boardsReducer } from './boards.reducer';
import { columnsReducer } from './columns.reducer';

export const reducers: ActionReducerMap<State> = {
  boards: boardsReducer,
  columnsState: columnsReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
