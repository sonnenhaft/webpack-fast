import { useEffect, useRef, useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  getErrorCodeAndMessage,
  noop,
  processRefreshTokenResponse,
  createHeaders
} from '#/helpers';
import { AuthContext, TranslateContext } from '#/utils/context';

import { AUTH_ACTIONS, EXPIRED_TOKEN_ERROR_CODES } from '#/constants';

import { useLazyQuery } from './useUncachedQuery';

import refreshMutation from '#/services/auth/refreshToken.graphql';
import logoutMutation from '#/services/auth/logoutMutation.graphql';

const { AUTO_LOGIN, LOGOUT } = AUTH_ACTIONS;

const isTokenExpired = queryError => {
  const { code } = getErrorCodeAndMessage(queryError) || {};

  return code && EXPIRED_TOKEN_ERROR_CODES.includes(code);
};

export const useLogout = ({ ufinityAccessToken, nagraAccessToken } = {}) =>
  useMutation(logoutMutation, {
    variables: {
      ufinityAccessToken,
      nagraAccessToken
    }
  });

export const useRefreshToken = ({
  nagra: { token: nagraToken, refreshToken: nagraRefreshToken } = {},
  ufinity: { token: ufinityToken, refreshToken: ufinityRefreshToken } = {},
  essoId
} = {}) =>
  useMutation(refreshMutation, {
    variables: {
      ufinityRefreshToken,
      nagraRefreshToken
    },
    context: {
      // TODO: Remove these headers once server logic updated
      headers: createHeaders({
        nagraToken,
        ufinityToken,
        essoId
      })
    }
  });

export const useRefreshWithCallback = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [callbackParams, setCallbackParams] = useState({});
  const onCompleteRef = useRef(null);

  const {
    nagra: { token: nagraToken } = {},
    ufinity: { token: ufinityToken } = {},
    isLoggedIn
  } = state || {};

  const onComplete = onCompleteRef.current;

  const [
    fetchRefreshToken,
    { data: { refreshToken = {} } = {}, error, loading }
  ] = useRefreshToken(state);

  const logoutUser = () => {
    dispatch({ type: LOGOUT });
    window?.location?.reload();
  };

  useEffect(() => {
    const { ufinity, nagra } = refreshToken || {};

    if (ufinity && nagra && !error) {
      dispatch({
        type: AUTO_LOGIN,
        tokens: processRefreshTokenResponse(refreshToken)
      });
      onComplete?.(callbackParams);
    } else if (error) {
      const { code = '' } = getErrorCodeAndMessage(error) || {};
      if (nagraToken && ufinityToken && !code.startsWith('A')) {
        logoutUser();
      }
    }
  }, [refreshToken, error]);

  const executeRefresh = (
    onRefreshComplete = noop,
    canRetry = true
  ) => params => {
    if (!canRetry) {
      logoutUser();

      return;
    }

    if (!isLoggedIn) {
      onRefreshComplete(params);

      return;
    }

    onCompleteRef.current = onRefreshComplete;
    fetchRefreshToken();
    setCallbackParams(params);
  };

  return [
    executeRefresh,
    {
      data: refreshToken,
      error,
      loading
    }
  ];
};

export const useHeaders = ({ nagraToken, ufinityToken }) => {
  const { state } = useContext(AuthContext);
  const { selectedLanguage: { value: acceptLanguage } = {} } = useContext(
    TranslateContext
  );

  const { tvId, isLite, isLoggedIn } = state || {};

  const {
    nagra: { token: nagraStoreToken } = {},
    ufinity: { token: ufinityStoreToken } = {}
  } = state || {};

  return createHeaders({
    acceptLanguage,
    tvId,
    isLite,
    isLoggedIn,
    nagraToken: nagraToken || nagraStoreToken,
    ufinityToken: ufinityToken || ufinityStoreToken
  });
};

export const useLazyRefreshQuery = ({
  gql,
  context,
  variables,
  withRefreshLoading = true,
  ...rest
}) => {
  const [
    performLazyQuery,
    { data, error: queryError, loading, variables: newVariables, ...restProps }
  ] = useLazyQuery({
    gql,
    context,
    variables,
    ...rest
  });
  const [canRetry, setCanRetry] = useState(true);

  const [
    performQueryWithRefreshToken,
    { error: refreshError, loading: refreshLoading }
  ] = useRefreshWithCallback();

  const combinedLoadingState = refreshLoading || loading;

  useEffect(() => {
    const tokenExpired = isTokenExpired(queryError);

    if (tokenExpired) {
      performQueryWithRefreshToken(performLazyQuery, canRetry)({
        variables: newVariables
      });
    }

    setCanRetry(!tokenExpired);
  }, [queryError]);

  return [
    performLazyQuery,
    {
      data,
      error: refreshError || queryError,
      loading: withRefreshLoading ? combinedLoadingState : loading,
      ...restProps
    }
  ];
};

export const useRefreshMutation = ({
  gql,
  withRefreshLoading = true,
  ...rest
}) => {
  const [params, setParams] = useState({});
  const [canRetry, setCanRetry] = useState(true);
  const [
    performMutationWithRefreshToken,
    {
      data: { nagra, ufinity } = {},
      error: refreshError,
      loading: refreshLoading
    }
  ] = useRefreshWithCallback();

  const { token: nagraToken } = nagra || {};
  const { token: ufinityToken } = ufinity || {};

  const headers = useHeaders({ nagraToken, ufinityToken });

  const [
    performMutation,
    {
      data,
      error: mutationError,
      loading,
      variables: newVariables,
      ...restMutation
    }
  ] = useMutation(gql, { ...rest });

  const [
    performMutationAfterRefresh,
    {
      data: dataAfterRefresh,
      error: mutationErrorAfterRefresh,
      loading: loadingAfterRefresh,
      ...restMutationAfterRefresh
    }
  ] = useMutation(gql, { context: { headers } });

  const saveParamsAndPerformMutation = parameters => {
    setParams(parameters);
    performMutation(parameters);
  };

  useEffect(() => {
    const tokenExpired = isTokenExpired(mutationError);

    if (tokenExpired) {
      performMutationWithRefreshToken(performMutationAfterRefresh, canRetry)({
        ...(newVariables ? { variables: newVariables } : {}),
        ...params
      });
    }

    setCanRetry(!tokenExpired);
  }, [mutationError]);

  const loadingState = withRefreshLoading
    ? [refreshLoading, loading, loadingAfterRefresh].some(Boolean)
    : loading;

  return [
    saveParamsAndPerformMutation,
    {
      data: dataAfterRefresh || data,
      error: refreshError || mutationErrorAfterRefresh || mutationError,
      loading: loadingState,
      ...restMutation,
      ...restMutationAfterRefresh
    }
  ];
};

export const useRefreshQuery = ({ gql, isCombinedLoading = true, ...rest }) => {
  const [
    performLazyQuery,
    { data, error: queryError, loading, variables: newVariables, ...restProps }
  ] = useLazyQuery({
    ...rest,
    gql
  });
  const [canRetry, setCanRetry] = useState(true);
  const [
    performQueryWithRefreshToken,
    { error: refreshError, loading: refreshLoading }
  ] = useRefreshWithCallback();

  useEffect(() => {
    performLazyQuery();
  }, []);

  useEffect(() => {
    const tokenExpired = isTokenExpired(queryError);

    if (tokenExpired) {
      performQueryWithRefreshToken(performLazyQuery, canRetry)({
        variables: newVariables
      });
    }

    setCanRetry(!tokenExpired);
  }, [queryError]);

  return {
    ...restProps,
    data,
    error: refreshError || queryError,
    loading: isCombinedLoading ? refreshLoading || loading : loading,
    refetch: performLazyQuery
  };
};
