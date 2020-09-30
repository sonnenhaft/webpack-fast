import React, { useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import localforage from 'localforage';

import { AUTH_ACTIONS, AUTH_TOKEN_KEY } from '#/constants';

import { getStorageValue } from '#/helpers';

const initialState = {
  isLoggedIn: false,
  currentProfile: null,
  ufinity: {},
  nagra: {},
  tvId: null,
  essoId: '',
  clientId: '',
  hubId: '',
  isLite: false,
  entitlements: null
};

const reducer = (
  state = initialState,
  { type, tokens = {}, entitlements = [] } = {}
) => {
  const { isLoggedIn, ...restTokens } = state || {};
  switch (type) {
    case AUTH_ACTIONS.LOGIN:
    case AUTH_ACTIONS.AUTO_LOGIN:
      localforage.setItem(AUTH_TOKEN_KEY, { ...restTokens, ...tokens });

      return { ...restTokens, ...tokens, isLoggedIn: true };

    case AUTH_ACTIONS.LOGOUT:
      localforage.removeItem(AUTH_TOKEN_KEY);

      return { ...initialState, isLoggedIn: false };

    case AUTH_ACTIONS.SET_ENTITLEMENTS:
      return { ...state, entitlements };

    default:
      return { ...state };
  }
};

const AuthContext = React.createContext(initialState);

function AuthProvider({ children }) {
  const [tokens, setTokens] = useState({});
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    nagra: { token: nagraToken, refreshToken: nagraRefreshToken } = {},
    ufinity: { token: ufinityToken, refreshToken: ufinityRefreshToken } = {}
  } = tokens || {};

  // refresh tokens
  useEffect(() => {
    if (
      nagraToken &&
      nagraRefreshToken &&
      ufinityToken &&
      ufinityRefreshToken
    ) {
      dispatch({ type: AUTH_ACTIONS.AUTO_LOGIN, tokens });
    }
  }, [nagraToken, nagraRefreshToken, ufinityToken, ufinityRefreshToken]);

  // load tokens
  useEffect(() => {
    const getAuthTokenKey = async () => {
      const authTokenKey = await getStorageValue(AUTH_TOKEN_KEY);
      setTokens(authTokenKey);
    };
    getAuthTokenKey();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node
};

export { AuthContext, AuthProvider };
