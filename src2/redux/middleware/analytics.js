import { startUsage, stopUsage } from '#/services/analytics/analytics';
import reduxModules from '../modules';

const {
  lifecycle: { actions }
} = reduxModules;

const analytics = () => next => action => {
  if (action) {
    if (action.type === actions.APP_START) {
      startUsage();
    } else if (action.type === actions.APP_QUIT) {
      stopUsage();
    }
  }

  return next(action);
};

export default analytics;
