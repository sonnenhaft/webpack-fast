import { XS } from '#/theme/variables/breakpoints';

export const PLATFORM = {
  chrome: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  safari: 'safari',
  other: 'other'
};

export const DEVICE_TYPE = {
  chrome: 'Chrome',
  android: 'Android',
  ios: 'IOS'
};

export const getPlatform = () => {
  if (!__CLIENT__) {
    return PLATFORM.other;
  }

  const { userAgent } = window.navigator;

  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return PLATFORM.safari;
  }
  if (userAgent.includes('Chrome')) {
    return PLATFORM.chrome;
  }
  if (userAgent.includes('Firefox')) {
    return PLATFORM.firefox;
  }

  return PLATFORM.other;
};

export const getDeviceType = () => {
  if (getPlatform() === PLATFORM.chrome || getPlatform() === PLATFORM.firefox) {
    return DEVICE_TYPE.chrome;
  }
  if (getPlatform() === PLATFORM.safari) {
    return DEVICE_TYPE.ios;
  }
};

export const getIosBrowser = () => {
  if (!__CLIENT__) {
    return PLATFORM.other;
  }

  const { userAgent } = window.navigator;

  if (getDeviceType() === DEVICE_TYPE.ios) {
    if (userAgent.indexOf('CriOS') !== -1) {
      return PLATFORM.chrome;
    }

    if (userAgent.indexOf('Version') !== -1) {
      return PLATFORM.safari;
    }

    return PLATFORM.other;
  }
};

export const getAndroidBrowser = () => {
  if (!__CLIENT__) {
    return PLATFORM.other;
  }

  const { userAgent } = window.navigator;

  if (userAgent.includes('Android') && getDeviceType() === DEVICE_TYPE.chrome) {
    return PLATFORM.chrome;
  }

  return PLATFORM.other;
};

export const isMobile = () => {
  if (!__CLIENT__) {
    return;
  }

  const { userAgent } = window.navigator;

  return userAgent.includes('Mobile') || window.innerWidth < XS;
};
