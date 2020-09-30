import localforage from 'localforage';
import UAParser from 'ua-parser-js';

const MAX_DEVICE_NAME_LENGTH = 64;

const ACCOUNT_TYPE = {
  ESSOID_MAIN: 'ESSOID_MAIN',
  ESSOID: 'ESSOID',
  TVID: 'TVID'
};

const userAgentFields = () => {
  const parsedUserAgent =
    __CLIENT__ && new UAParser(window.navigator.userAgent);

  const { name: type, version } = parsedUserAgent?.getOS() || {};
  const browser = parsedUserAgent.getBrowser();

  return {
    browser,
    type,
    version
  };
};

export const noop = () => {};

export const emptyJsonString = '{"":""}';

export const numOfKeys = obj => Object.keys(obj || {})?.length;

export const hasExpired = (value = 0, currentTimestamp) => {
  const diff = value - currentTimestamp;

  return (diff > 0 && diff < 300) || diff < 0;
};

export const getCurrentTimestamp = () => new Date().getTime() / 1000;

export const getDeviceInfo = () => {
  const { browser, type, version } = userAgentFields();

  return {
    device: {
      OS: {
        type,
        version
      },
      hardware: {
        type: 'Browser',
        manufacturer: browser.name,
        model: browser.version
      }
    },
    securePlayer: {}
  };
};

export const getDeviceName = () => {
  const { browser, type } = userAgentFields();

  return `${type} - ${browser.name}`.substring(0, MAX_DEVICE_NAME_LENGTH);
};

export const addTimeStampToToken = (response = {}) => {
  const { tokenExpiresIn, refreshTokenExpiresIn, ...rest } = response || {};
  const currentTimestamp = getCurrentTimestamp();

  if (!tokenExpiresIn) {
    return response;
  }

  return {
    ...rest,
    ...(refreshTokenExpiresIn && {
      refreshTokenExpiresIn: refreshTokenExpiresIn + currentTimestamp
    }),
    tokenExpiresIn: tokenExpiresIn + currentTimestamp
  };
};

export const processRefreshTokenResponse = (data = {}) =>
  Object.keys(data).reduce((acc, curr) => {
    const value = data[curr];

    if (typeof value !== 'object') {
      return acc;
    }

    return {
      ...acc,
      [curr]: addTimeStampToToken(value)
    };
  }, {});

const getAccountType = (tvId, isLite) => {
  const essoIdType = !isLite ? ACCOUNT_TYPE.ESSOID_MAIN : ACCOUNT_TYPE.ESSOID;

  return {
    'x-sh-u-account-type': tvId?.length ? ACCOUNT_TYPE.TVID : essoIdType
  };
};

export const createHeaders = ({
  nagraToken,
  ufinityToken,
  essoId,
  acceptLanguage,
  tvId,
  isLite,
  isLoggedIn
}) => ({
  ...(nagraToken ? { 'x-sh-n': nagraToken } : {}),
  ...(ufinityToken ? { 'x-sh-u': ufinityToken } : {}),
  ...(essoId ? { 'x-sh-nu': essoId } : {}),
  ...(acceptLanguage && { 'accept-language': acceptLanguage }),
  ...(isLoggedIn && getAccountType(tvId, isLite))
});

export const getStorageValue = async key => {
  try {
    const storageValue = await localforage.getItem(key);

    return storageValue;
  } catch (error) {
    if (__DEVTOOLS__) {
      console.warn('Localforage error');
    }
  }
};

export const getEntitlement = ({ entitlements = {}, productRefs = [] }) =>
  productRefs?.reduce((isEntitledAcc, productRef) => {
    if (!isEntitledAcc) {
      return Boolean(entitlements?.[productRef]);
    }

    return isEntitledAcc;
  }, false);

export const getParsedObject = string => {
  try {
    return JSON.parse(string);
  } catch (error) {
    console.warn('Invalid object configuration');

    return {};
  }
};

export const getParsedArray = (string, delimiter) => {
  try {
    const parsedArray = string
      ?.substring(1, string.length - 1)
      .split(delimiter);
    const formattedParsedArray = parsedArray?.map(element =>
      element.substring(1, element.length - 1)
    );

    return formattedParsedArray;
  } catch (error) {
    console.warn('Invalid array configuration');

    return [];
  }
};

export const getExitPageHandler = (
  history = { goBack: noop, push: noop }
) => () => {
  if (history?.action === 'PUSH') {
    history?.goBack();

    return;
  }

  history.push('/');
};

export const toLowerCase = (value = '') => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.toLowerCase();
};

export const getErrorCodeAndMessage = error => {
  const { graphQLErrors } = error || {};
  const [{ code, message } = {}] = graphQLErrors || [];

  return { code, message };
};

export const comparePins = (pin, reEnteredPin) => {
  if (pin.length >= 6 && reEnteredPin.length >= 6) {
    return pin === reEnteredPin;
  }

  return true;
};

export const isFalse = value => typeof value === 'boolean' && !value;

export const clearRouteState = (route = '') =>
  window?.history?.replaceState?.(undefined, '', route);

export const showParentalCheckForChannel = (
  tvChannel,
  id,
  restrictedChannels = []
) => {
  return restrictedChannels.find(
    ({ tvChannel: channelNum, id: channelId } = {}) => {
      return tvChannel === channelNum || id === channelId;
    }
  );
};

export const isStreamDurationFinite = playerInstance => {
  if (!playerInstance) {
    return;
  }

  return Number.isFinite(playerInstance?.duration());
};

export const createAndDispatchEvent = (eventName, state) => {
  const event = new CustomEvent(eventName, { detail: state });

  window.dispatchEvent(event);
};
