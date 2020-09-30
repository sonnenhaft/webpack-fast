import { handleActions } from 'redux-actions';
import { TOGGLE_MENU, COLLAPSE_MENU, UNCOLLAPSE_MENU } from './actions';

/**
 * The initial state if no state is provided.
 * @type {Object}
 */
const initialState = {
  isCollapsed: true
};

const toggleMenu = (state = initialState) => {
  return {
    ...state,
    isCollapsed: !state.isCollapsed
  };
};

const collapseMenu = (state = initialState) => {
  return {
    ...state,
    isCollapsed: true
  };
};

const uncollapseMenu = (state = initialState) => {
  return {
    ...state,
    isCollapsed: false
  };
};

const reducer = handleActions(
  {
    [TOGGLE_MENU]: toggleMenu,
    [UNCOLLAPSE_MENU]: uncollapseMenu,
    [COLLAPSE_MENU]: collapseMenu
  },
  initialState
);

export default reducer;
