import { useEffect, useState, useContext } from 'react';
import cookie from 'react-cookie';
import localforage from 'localforage';
import {
  useNagraLogin,
  useClientIdLogin,
  useOauthUfinityLogin
} from '#/services/auth';

import { ConfigContext } from '#/utils/context';
import {
  getDeviceInfo,
  getDeviceName,
  getStorageValue,
  numOfKeys,
  addTimeStampToToken
} from '#/helpers';
import {
  isClientIdDeletedCheck,
  isDeviceLimitReachedCheck,
  isAccountSuspended
} from './errorCodeCheck';
import { getRedirectUri } from '#/views/LoginPage/useOauthUfinityModal';

const ESSOID_OR_TVID_MAP = 'shh-essoid-tvid-map';
const INCORRECT_ERROR = 'signinIncorrectIDPWError';
const INVALID_OAUTH_STATE = 'INVALID_OAUTH_STATE';

const prepareTokens = (nagraToken, clientIdToken, apiData, hubId) => {
  const isNagraLoginValid = nagraToken?.nagra?.token;

  const nagra = isNagraLoginValid ? nagraToken?.nagra : clientIdToken?.nagra;

  if (!apiData?.ufinity || !numOfKeys(nagra)) {
    return null;
  }

  return {
    ...apiData,
    hubId,
    nagra,
    clientId: nagraToken?.clientId
  };
};

const formatError = error => {
  const { graphQLErrors = [], message: errorMessage = '' } = error || {};

  const { message } = graphQLErrors[0] || {};

  return {
    message: message || errorMessage
  };
};

const addToEssoIdOrTvIdMap = async newLogin => {
  const essoIdOrTvIdMap = await getStorageValue(ESSOID_OR_TVID_MAP);

  localforage.setItem(ESSOID_OR_TVID_MAP, {
    ...essoIdOrTvIdMap,
    ...newLogin
  });
};

const useSecondLogin = ({
  ufinity: { token: ufinityToken } = {},
  essoId,
  tvId,
  tvIdSelectedFromState
} = {}) => {
  const [singleTvId] = tvId || [];
  const essoIdOrTvId = singleTvId?.id?.trim() || essoId;
  const [secondLogin, { data, error }] = useNagraLogin({
    deviceInfo: getDeviceInfo(),
    essoIdOrTvId,
    name: getDeviceName(),
    ufinityToken
  });

  const { nagraLogin: { nagra, clientId } = {} } = data || {};

  useEffect(() => {
    if (!nagra || !clientId) {
      return;
    }

    addToEssoIdOrTvIdMap({ [tvIdSelectedFromState || essoIdOrTvId]: clientId });
  }, [nagra, clientId]);

  return [secondLogin, { nagra: addTimeStampToToken(nagra), clientId }, error];
};

const useLoginWithClientId = (
  { ufinity: { token: ufinityToken } = {}, essoId, tvId } = {},
  essoIdOrTvIdMap
) => {
  const [singleTvId] = tvId || [];
  const trimmedTvId = singleTvId?.id?.trim();
  const clientIdFromCookie =
    essoIdOrTvIdMap?.[trimmedTvId] || essoIdOrTvIdMap?.[essoId];

  const [reLogin, { data, error }] = useClientIdLogin({
    clientId: clientIdFromCookie,
    essoIdOrTvId: trimmedTvId || essoId,
    ufinityToken
  });

  const { nagraLogin: { nagra, clientId } = {} } = data || {};

  return [reLogin, { nagra: addTimeStampToToken(nagra), clientId }, error];
};

const useLogin = (clearCode, code, state) => {
  const { messages } = useContext(ConfigContext);
  const [error, setError] = useState(null);
  const isValidState = code && state && cookie.load('loginstate') === state;
  useEffect(() => {
    if (code && !isValidState) {
      setError({
        // man in the middle attack is here, oauth was intercepted
        messages: messages[INVALID_OAUTH_STATE]
      });
    }
  }, [code, isValidState]);
  useEffect(() => {
    error && code && clearCode();
  }, [error, code]);
  const [essoIdOrTvIdMap, setEssoIdOrTvIdMap] = useState({});
  const [ufinityLoginData, setUfinityLoginData] = useState({});

  // eslint-disable-next-line prefer-const
  let [login, { data, error: loginError }] = useOauthUfinityLogin(
    code,
    getRedirectUri()
  );

  if (code && !isValidState) {
    login = () => {};
  }
  const [secondLogin, nagraToken, nagraLoginError] = useSecondLogin(
    ufinityLoginData
  );
  const [reLogin, clientIdToken, nagraClientError] = useLoginWithClientId(
    ufinityLoginData,
    essoIdOrTvIdMap
  );

  const tokens = prepareTokens(
    nagraToken,
    clientIdToken,
    ufinityLoginData,
    ufinityLoginData?.essoId
  );
  const isLoginComplete = Boolean((tokens?.nagra && tokens?.ufinity) || error);

  useEffect(() => {
    const useSetStateForTvIdMap = async () => {
      const essoIdOrTvIdMapFromStore = await getStorageValue(
        ESSOID_OR_TVID_MAP
      );
      setEssoIdOrTvIdMap(essoIdOrTvIdMapFromStore);
    };
    useSetStateForTvIdMap();
  }, []);

  useEffect(() => {
    if (error && !nagraLoginError) {
      setError(null);
    }
  }, [code, nagraLoginError]);

  // check if clientId is deleted
  useEffect(() => {
    if (isClientIdDeletedCheck(nagraClientError)) {
      secondLogin();
    }
  }, [nagraClientError]);

  // check if device limit reached
  useEffect(() => {
    if (nagraLoginError) {
      const actualError = formatError(nagraLoginError);
      setError(
        isDeviceLimitReachedCheck(nagraLoginError)
          ? actualError
          : {
              message: messages[INCORRECT_ERROR]
            }
      );
    }
  }, [nagraLoginError]);

  useEffect(() => {
    const authError = loginError || nagraClientError;

    if (authError) {
      const actualError = formatError(authError);

      const suspendedError = isAccountSuspended(authError) && actualError;

      const defaultError = actualError?.message
        ? { message: messages[INCORRECT_ERROR] }
        : actualError;

      setError(suspendedError || defaultError);
    }
  }, [loginError, nagraClientError]);

  useEffect(() => {
    const { login: loginData } = data || {};

    if (!loginData) {
      return;
    }

    const { ufinity, ...rest } = loginData;

    setUfinityLoginData(
      { ...rest, ufinity: addTimeStampToToken(ufinity) } || {}
    );
  }, [numOfKeys(data)]);

  useEffect(() => {
    if (numOfKeys(ufinityLoginData) < 1) {
      return;
    }

    const { essoId, tvId } = ufinityLoginData;
    if (tvId?.length > 1) {
      return;
    }

    const [singleTvId] = tvId || [];
    const clientId = essoIdOrTvIdMap?.[singleTvId?.id?.trim() || essoId];
    const finishLogin = clientId ? reLogin : secondLogin;

    finishLogin();
  }, [ufinityLoginData]);

  return {
    ufinityLoginData,
    isLoginComplete,
    login,
    loginError: error,
    tokens
  };
};

export {
  addToEssoIdOrTvIdMap,
  formatError,
  prepareTokens,
  useLogin,
  useLoginWithClientId,
  useSecondLogin
};
