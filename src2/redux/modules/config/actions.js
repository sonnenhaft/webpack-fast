import { createAction } from 'redux-actions';
import selectors from './selectors';
import {
  getServiceData,
  onServiceReceive,
  serviceRetry,
  serviceInvalidate
} from '../../utils/reduxHelper';

export const REQUEST = 'app/REQUEST_CONFIG';
export const RECEIVE = 'app/RECEIVE_CONFIG';
export const INVALIDATE = 'app/INVALIDATE_CONFIG';

const onReceive = onServiceReceive({ property: 'configuration' });

const receiveConfig = createAction(RECEIVE, onReceive);
const requestConfig = createAction(REQUEST);
const invalidateConfig = createAction(INVALIDATE);

const getData = getServiceData({ selectors, requestConfig, receiveConfig });

const retry = serviceRetry({ invalidateConfig, getData });

const invalidate = serviceInvalidate(invalidateConfig);

export default {
  getData,
  retry,
  invalidate
};
