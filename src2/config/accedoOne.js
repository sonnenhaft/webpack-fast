/*
 *** ACCEDO ONE CONFIGURATIONS ***
 *
 *  Configurations for an Accedo One client.
 */

import accedoOne from '@accedo/accedo-one-express';

export const ACCEDO_ONE_PROFILE = 'a1_p';
export const ACCEDO_ONE_SERVICE = 'a1_svc';
export const DEVICE_ID = 'a1_d';
export const SESSION_KEY = 'a1_s';
export const SIXTY_YEARS_IN_MS = 2147483647000; // from node_modules/@accedo/accedo-one-express/src/index.js
export const HTTP_ONLY = false; // if cookies need to be retrieved from the client, this should be false
export const SECURE_FLAG = !__LOCAL__; // disable secure flag when building on local environment

const { ACCEDO_ONE_KEY } = __ENV_CONFIG__;

export default {
  appKey: process.env.ACCEDO_ONE_KEY || ACCEDO_ONE_KEY,
  getRequestInfo: req => {
    const { cookies } = req;

    return {
      ...accedoOne.defaultGetRequestInfo(req),
      deviceId: cookies[DEVICE_ID],
      sessionKey: cookies[SESSION_KEY]
    };
  },
  onSessionKeyChanged: (key, res) => {
    res.cookie(SESSION_KEY, key, {
      httpOnly: HTTP_ONLY,
      maxAge: SIXTY_YEARS_IN_MS,
      secure: SECURE_FLAG
    });
  },
  onDeviceIdGenerated: (key, res) => {
    res.cookie(DEVICE_ID, key, {
      httpOnly: HTTP_ONLY,
      maxAge: SIXTY_YEARS_IN_MS,
      secure: SECURE_FLAG
    });
  }
};
