import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useLazyRefreshQuery } from '#/services/graphql/refreshHooks';
import { createHeaders, noop } from '#/helpers';
import { AUTH_ACTIONS } from '#/constants';
import { useDestructureFromAuthContext } from '#/helpers/hooks';

import entitlementQuery from './entitlementQuery.graphql';
import ufinityLogin from './ufinityLogin.graphql';
import oauthUfinityLogin from './oauthUfinityLogin.graphql';
import nagraLogin from './nagraLogin.graphql';
import clientIdLogin from './clientIdLogin.graphql';

import { AuthContext } from '#/utils/context';

export const useUfinityLogin = (username, password) =>
  useMutation(ufinityLogin, {
    variables: {
      username,
      password
    },
    onError: error => __DEVTOOLS__ && console.warn(error)
  });

export const useOauthUfinityLogin = (code, redirectUri) =>
  useMutation(oauthUfinityLogin, {
    variables: { code, redirectUri },
    onError: error => __DEVTOOLS__ && console.warn(error)
  });

export const useNagraLogin = ({
  deviceInfo,
  essoIdOrTvId,
  name,
  ufinityToken
} = {}) =>
  useMutation(nagraLogin, {
    variables: {
      deviceInfo,
      essoIdOrTvId,
      name,
      ufinityToken
    },
    onError: error => __DEVTOOLS__ && console.warn(error)
  });

export const useClientIdLogin = ({
  clientId,
  essoIdOrTvId,
  ufinityToken
} = {}) =>
  useMutation(clientIdLogin, {
    variables: { clientId, essoIdOrTvId, ufinityToken },
    onError: error => __DEVTOOLS__ && console.warn(error)
  });

export const useEntitlement = ({ nagraToken = '', ufinityToken = '' } = {}) => {
  const { dispatch = noop, isLoggedIn } = useDestructureFromAuthContext(
    AuthContext
  );

  const [entitlements, setEntitlements] = useState(null);
  const [
    fetchEntitlement,
    { data: { entitlements: list } = {}, loading }
  ] = useLazyRefreshQuery({
    gql: entitlementQuery,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    skipCache: true,
    useCache: false,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all'
  });

  useEffect(() => {
    const length = list?.length;

    if (!loading && typeof length !== 'undefined') {
      if (length > 0) {
        setEntitlements(
          list.reduce(
            (acc, curr) => ({
              ...acc,
              ...(curr?.productId && { [curr.productId]: curr })
            }),
            {}
          )
        );

        return;
      }

      setEntitlements({});
    }
  }, [list, loading]);

  useEffect(() => {
    if (!loading && isLoggedIn && entitlements) {
      dispatch({ type: AUTH_ACTIONS.SET_ENTITLEMENTS, entitlements });
    }
  }, [entitlements, loading]);

  return { entitlements, fetchEntitlement, loading };
};
