import { MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { State } from '../state.model';
import { boardsReducer } from './boards.reducer';

export const state = {
  boards: boardsReducer,
};

// export const reducers: ActionReducerMap<State> = {};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
