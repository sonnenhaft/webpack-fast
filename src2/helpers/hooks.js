import { useContext } from 'react';
import { noop } from '#/helpers';

export const useDestructureFromAuthContext = authContext => {
  const {
    dispatch = noop,
    state: {
      isLoggedIn,
      entitlements = {},
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(authContext);

  return {
    dispatch,
    entitlements,
    isLoggedIn,
    nagraToken,
    ufinityToken
  };
};
