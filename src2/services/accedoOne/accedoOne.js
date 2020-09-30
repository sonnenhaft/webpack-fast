import accedoOne from '@accedo/accedo-one';
import cookie from 'react-cookie';
import * as vikimap from '@accedo/vdkweb-vikimap';

import accedoOneConfig, {
  DEVICE_ID,
  SESSION_KEY,
  SIXTY_YEARS_IN_MS
} from '#/config/accedoOne';
import * as configuration from '#/services/configuration/configuration';
import * as status from '#/services/status/status';

let client;

export const getAccedoOneClient = (customizedConfig = null) => {
  if (!accedoOneConfig?.appKey && !customizedConfig?.accedoOne?.appKey) {
    console.error('No Accedo One settings available..');

    return null;
  }

  let accedoOneSettings = customizedConfig || accedoOneConfig;

  if (__CLIENT__) {
    accedoOneSettings = {
      ...accedoOneSettings,
      browserInfoProvider: () => ({
        deviceId: cookie.load(DEVICE_ID),
        sessionKey: cookie.load(SESSION_KEY)
      }),
      onDeviceIdGenerated: id => {
        cookie.save(DEVICE_ID, id, { path: '/', maxAge: SIXTY_YEARS_IN_MS });
      },
      onSessionKeyChanged: key => {
        cookie.save(SESSION_KEY, key, {
          path: '/',
          maxAge: SIXTY_YEARS_IN_MS
        });
      }
    };
  }

  client = client || accedoOne(accedoOneSettings);

  return client;
};

export const getAccedoOneServices = accedoOneClient => ({
  configuration: configuration.getAccedoOneService(accedoOneClient),
  status: status.getAccedoOneService(accedoOneClient),
  vikimap: vikimap.getAccedoOneService(accedoOneClient)
});
