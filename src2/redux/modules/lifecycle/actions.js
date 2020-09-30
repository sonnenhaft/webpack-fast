import { createAction as actionCreatorFactory } from 'redux-actions';

export const APP_START = 'app/APP_START';
export const APP_QUIT = 'app/APP_QUIT';

export const appStart = actionCreatorFactory(APP_START);
export const appQuit = actionCreatorFactory(APP_QUIT);
