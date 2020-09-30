let rootSelector = state => state;

const getRootSelector = () => rootSelector;

const setRootSelector = selector => {
  rootSelector = selector;
};

const getData = (state, key) => {
  const rootState = rootSelector(state);

  if (!rootState) {
    return;
  }

  if (key) {
    return rootState[key];
  }

  return rootState;
};

const getAccedoOne = state => {
  const content = getData(state, 'content');

  return content?.accedoOne;
};

export default {
  getAccedoOne,
  getData,
  getRootSelector,
  setRootSelector
};
