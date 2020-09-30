// helpers for useRemoveDevices hook
const getCollectiveState = (key = '') => (idList = [], hookList = []) => {
  return idList
    .reduce((acc, _, idx) => [...acc, hookList[idx]?.[key]], [])
    .some(Boolean);
};

export const getLoading = getCollectiveState('loading');
export const getError = getCollectiveState('error');
