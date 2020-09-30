import { combineReducers } from 'redux';

import modules from './modules';

import extractReducers from './utils/extractReducers';
import registerModules from './utils/registerModules';

const MODULES_MOUNT_POINT = 'modules';

// Register the modules that we'd like to use
// and update their root selectors with the modules
// mount point
registerModules(modules, MODULES_MOUNT_POINT);

// Extract the reducers from the redux modules
// so we can combine them into one root reducer
// for the application.
const moduleReducers = extractReducers(modules);

// Export the root reducer
export const rootReducer = combineReducers({
  [MODULES_MOUNT_POINT]: combineReducers({ ...moduleReducers })
});
