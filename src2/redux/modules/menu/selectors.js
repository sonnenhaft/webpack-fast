let rootSelector = state => state.menu;
const isCollapsedSelector = state => rootSelector(state).isCollapsed;

// Required to set the root selector externally, since the module isn't aware of the
// global state shape.
export const setRootSelector = selector => {
  rootSelector = selector;
};

export const getMenuState = state => rootSelector(state);
export const getMenuIsCollapsed = state => isCollapsedSelector(state);
