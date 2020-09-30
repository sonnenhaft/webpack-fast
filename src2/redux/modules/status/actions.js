import { createAction } from 'redux-actions';
import selectors from './selectors';
import {
  getServiceData,
  onServiceReceive,
  serviceRetry,
  serviceInvalidate
} from '../../utils/reduxHelper';

export const REQUEST = 'app/REQUEST_STATUS';
export const RECEIVE = 'app/RECEIVE_STATUS';
export const INVALIDATE = 'app/INVALIDATE_STATUS';

const onReceive = onServiceReceive({
  property: 'status',
  get: 'getAppStatus'
});

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
