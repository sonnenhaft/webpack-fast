import { handleActions } from 'redux-actions';
import * as reduxHelper from '../../utils/reduxHelper';
import { REQUEST, RECEIVE, INVALIDATE } from './actions';

const isUndefined = value => typeof value === 'undefined';

const requestStatus = (state, action) => {
  const key = action.payload;

  if (isUndefined(key)) {
    return reduxHelper.applyRequestInfo(state);
  }

  const data = key ? state[key] : state;

  return {
    ...state,
    [key]: reduxHelper.applyRequestInfo(data)
  };
};

const receiveStatusError = (state, action) => {
  const { error, __key } = action.payload;

  if (isUndefined(__key)) {
    return reduxHelper.applyErrorInfo(state);
  }

  return {
    ...state,
    [__key]: reduxHelper.applyErrorInfo({ content: error })
  };
};

const receiveStatus = (state, action) => {
  const { content, __key } = action.payload;
  if (isUndefined(__key)) {
    return {
      ...reduxHelper.applyReceiveInfo(state),
      content
    };
  }

  return {
    ...state,
    [__key]: reduxHelper.applyReceiveInfo({ content })
  };
};

const invalidateStatus = (state, action) => {
  const key = action.payload;

  if (isUndefined(key)) {
    return reduxHelper.applyInvalidationInfo(state);
  }

  const data = key ? state[key] : state;

  return {
    ...state,
    [key]: reduxHelper.applyInvalidationInfo(data)
  };
};

const reducer = handleActions(
  {
    [REQUEST]: requestStatus,
    [RECEIVE]: {
      next: receiveStatus,
      throw: receiveStatusError
    },
    [INVALIDATE]: invalidateStatus
  },
  {}
);

export default reducer;
