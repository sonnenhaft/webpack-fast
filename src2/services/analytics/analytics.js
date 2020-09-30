import { getAccedoOneClient } from '../accedoOne/accedoOne';

const call = funcName => {
  const client = getAccedoOneClient();

  return client[funcName]().catch(err => {
    // If we fail to send the event to Accedo One
    // we'll catch it and return the error.
    return err;
  });
};

export const startUsage = () => {
  return call('sendUsageStartEvent');
};

export const stopUsage = () => {
  return call('sendUsageStopEvent');
};
