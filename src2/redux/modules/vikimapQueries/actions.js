import { createAction } from 'redux-actions';
import {
  getServiceData,
  serviceRetry,
  serviceInvalidate
} from '../../utils/reduxHelper';

import selectors from './selectors';
import queryParser from './queryParser';

export const REQUEST = 'app/REQUEST_QUERY_DATA';
export const RECEIVE = 'app/RECEIVE_QUERY_DATA';
export const INVALIDATE = 'app/INVALIDATE_QUERY_DATA';

const onReceive = async (services, query) => {
  try {
    const { data, ovpKey } = await queryParser.executeQuery(query);

    if (Array.isArray(data)) {
      data.forEach(item => {
        item.__ovpKey = ovpKey;
      });
    } else if (typeof data === 'object') {
      data.__ovpKey = ovpKey;
    }

    return { __key: query, content: data };
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw { __key: query, error };
  }
};

const receiveConfig = createAction(RECEIVE, onReceive);
const requestConfig = createAction(REQUEST);
const invalidateConfig = createAction(INVALIDATE);

const getData = getServiceData({ selectors, requestConfig, receiveConfig });

const retry = serviceRetry({ invalidateConfig, getData });

// Invalidate the query data, then try requesting it again.
const invalidate = serviceInvalidate(invalidateConfig);

export default {
  getData,
  retry,
  invalidate
};
