import * as ovp from '../services/ovp';
import * as configuration from '../services/configuration/configuration';
import * as status from '../services/status/status';

// Collect services to provide to the store
export default {
  ovp,
  configuration,
  status
};
