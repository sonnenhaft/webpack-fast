import { useEffect, useState, useContext } from 'react';
import { AUTH_ACTIONS } from '#/constants';

import { useRefreshToken, useLogout } from '#/services/graphql/refreshHooks';
import { AuthContext } from '../context';

import {
  numOfKeys,
  hasExpired,
  getCurrentTimestamp,
  processRefreshTokenResponse
} from '#/helpers';

const { AUTO_LOGIN, LOGOUT } = AUTH_ACTIONS;

// use following hook before every query requiring auth tokens
export const useRefreshTokenOnExpiration = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [isActionComplete, setIsActionComplete] = useState(false);

  const {
    nagra: { tokenExpiresIn: nagraExpiresIn } = {},
    ufinity: { tokenExpiresIn: ufinityExpiresIn } = {}
  } = state || {};

  const [
    getRefreshToken,
    { data: { refreshToken = {} } = {}, error: refreshError }
  ] = useRefreshToken(state);

  const [logout] = useLogout({
    ufinityAccessToken: state?.ufinity?.token,
    nagraAccessToken: state?.nagra?.token
  });

  useEffect(() => {
    const { ufinity, nagra } = refreshToken || {};

    if (ufinity && nagra && !refreshError) {
      dispatch({
        type: AUTO_LOGIN,
        tokens: processRefreshTokenResponse(refreshToken)
      });
    } else if (refreshError) {
      logout();
      dispatch({ type: LOGOUT });
    }

    setIsActionComplete(true);
  }, [numOfKeys(refreshToken), numOfKeys(refreshError)]);

  useEffect(() => {
    const currentTimestamp = getCurrentTimestamp();

    if (
      hasExpired(nagraExpiresIn, currentTimestamp) ||
      hasExpired(ufinityExpiresIn, currentTimestamp)
    ) {
      getRefreshToken();
    } else {
      setIsActionComplete(true);
    }
  }, []);

  return { isActionComplete, error: refreshError };
};
