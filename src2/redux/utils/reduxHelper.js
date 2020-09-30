/**
 * Apply appropriate flags for an object that
 * has just been received in an asynchronous
 * redux action flow.
 *
 *  The following flags will be added:
 * __isFetching: false
 * __didInvalidate: false
 * __isError: false
 *
 * @param  {object} obj The object to extend with receive information
 * @return {object}     A new object with the extra information
 */
export const applyReceiveInfo = obj => {
  return {
    ...obj,
    __isFetching: false,
    __didInvalidate: false,
    __isError: false
  };
};

/**
 * Apply appropriate flags for an object that
 * has just been requested in an asynchronous
 * redux action flow
 *
 *  The following flags will be added:
 * __isFetching: true
 * __didInvalidate: false
 * __isError: false
 *
 * @param  {object} obj The object to extend with request information
 * @return {object}     A new object with the extra information
 */
export const applyRequestInfo = obj => {
  return {
    ...obj,
    __isFetching: true,
    __didInvalidate: false,
    __isError: false
  };
};

/**
 * Apply appropriate flags for an object that
 * has just failed to be requested in an asynchronous
 * redux action flow
 *
 *  The following flags will be added:
 * __isFetching: false
 * __didInvalidate: false
 * __isError: true
 *
 * @param  {object} obj The object to extend with error information
 * @return {object}     A new object with the extra information
 */
export const applyErrorInfo = obj => {
  return {
    ...obj,
    __isFetching: false,
    __didInvalidate: false,
    __isError: true
  };
};

/**
 * Apply appropriate flags for an object that
 * has just been invalidated in an asynchronous
 * redux action flow
 *
 *  The following flags will be added:
 * __didInvalidate: true
 *
 * @param  {object} obj The object to extend with invalidation information
 * @return {object}     A new object with the extra information
 */
export const applyInvalidationInfo = obj => {
  return {
    ...obj,
    __didInvalidate: true
  };
};

/**
 * Checks if we are allowed to fetch data
 * based on the data we already have.
 *
 * - If we don't have any data yet, we can go ahead
 * and fetch.
 * - If the data already is in 'fetching' state (__isFetching) we don't
 * want to fetch new data.
 * - If the data has been invalidated (__didInvalidate) we
 * can discard the data we have and fetch new.
 * - Otherwise we'll keep the data we have and don't fetch
 *
 * @param  {object} data   The data to evaluate
 * @return {boolean}       Whether  the data should be fetch or not
 */
export const shouldFetchData = data => {
  // If we didn't find any data in state
  // we should fetch.
  if (!data || typeof data.__isFetching === 'undefined') {
    return true;
  }

  // If we're already fetching data with this ID
  // we should hold off.
  if (data.__isFetching) {
    return false;
  }

  // If the data object has been invalidated we should fetch
  // a new one, otherwise use the one we have
  if (data.__didInvalidate) {
    return true;
  }

  return false;
};

/**
 * onServiceReceive
 *
 * helper function used to build onReceive methods for services
 *
 * @param {object} options
 * @param {string} options.property the property to be accessed on the promise object
 * @param {string} options.get the get method used
 */

export const onServiceReceive = ({ property, get = 'get' }) => {
  return async services => {
    try {
      const content = await services[property][get]();

      return { content };
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      throw { error };
    }
  };
};

/**
 * helper function used to create Thunk actions for getting
 * data asynchronously. First checks the data we already have
 * in state to evaluate if we actually need to fetch any new data.
 *
 * If found that the data we have is valid, we'll simply
 * resolve immediately without dispatching any actions.
 *
 * If found that we don't have any data yet or the data we
 * have is invalid, we'll first dispatch a REQUEST action
 * to notify that the request has started. Then we'll
 * dispatch a RECEIVE action. We pass the available services
 * and the key informatio to the receive action which will
 * make the actual service request and typically return
 * a promise to be resolved with the data from the service
 * call.
 *
 * To use this action, you'll need to configure redux-thunk
 * and redux-promise as middlewares in your Redux store, to be
 * able to handle thunk actions and promise payloads.
 *
 * @param  {object} key                If we're fetching information based on a
 *                                     key, it will be specified here.
 * @param  {function} onShouldFetch)   For overriding the data validation mechanism
 *                                     deciding if we should fetch data or not.
 * @return {Promise}                   A promise that will be resolved when the action
 *                                     is done.
 */

export const getServiceData = ({ selectors, requestConfig, receiveConfig }) => (
  key,
  onShouldFetch
) => async (dispatch, getState, services) => {
  if (!selectors || !selectors.getData) {
    return Promise.reject();
  }

  // Try getting the data from the state to begin with
  const data = selectors.getData(getState(), key);

  // What do we advise to do judging by the data we already have in state?
  const shouldFetchDataAdvise = shouldFetchData(data);

  // Verify if the data we found in the state is still valid
  // or if we need to fetch new data
  if (
    (onShouldFetch && !onShouldFetch(data, key, shouldFetchDataAdvise)) ||
    !shouldFetchDataAdvise
  ) {
    return Promise.resolve();
  }

  // Notify that the request is in progress
  dispatch(requestConfig(key));

  // Launch the request
  return dispatch(receiveConfig(services, key));
};

// Invalidate the query data, then try requesting it again.
export const serviceRetry = ({ invalidateConfig, getData }) => key => (
  dispatch,
  getState,
  services
) => {
  // Invalidate the query data, then try requesting it again.
  dispatch(invalidateConfig(key));

  return getData(key)(dispatch, getState, services);
};

// Invalidate the query data, then try requesting it again.
export const serviceInvalidate = invalidateConfig => key => dispatch =>
  dispatch(invalidateConfig(key));
