import {
  useQuery,
  useLazyQuery as useApolloLazyQuery
} from '@apollo/react-hooks';
import { useContext } from 'react';
import { createHeaders } from '#/helpers';
import { AuthContext, TranslateContext } from '#/utils/context';

export const getContext = ({ context, acceptLanguage, authState }) => {
  const { headers, ...rest } = context || {};
  const { tvId, isLite, isLoggedIn } = authState || {};

  return {
    context: {
      ...rest,
      headers: {
        ...headers,
        ...createHeaders({ acceptLanguage, isLoggedIn, tvId, isLite })
      }
    }
  };
};

export const useUncachedQuery = ({ gql, context, ...rest } = {}) => {
  const { selectedLanguage: { value: acceptLanguage } = {} } = useContext(
    TranslateContext
  );

  const { state: authState } = useContext(AuthContext);

  return useQuery(gql, {
    ...getContext({ context, acceptLanguage, authState }),
    skipCache: true,
    useCache: false,
    ...rest
  });
};

export const useQueryWithVariables = ({ context, gql, variables, ...rest }) => {
  const { selectedLanguage: { value: acceptLanguage } = {} } = useContext(
    TranslateContext
  );

  const { state: authState } = useContext(AuthContext);

  return useQuery(gql, {
    ...getContext({ context, acceptLanguage, authState }),
    variables,
    skipCache: true,
    useCache: false,
    ...rest
  });
};

export const useLazyQuery = ({ gql, context, variables, ...rest }) => {
  const { selectedLanguage: { value: acceptLanguage } = {} } = useContext(
    TranslateContext
  );

  const { state: authState } = useContext(AuthContext);

  return useApolloLazyQuery(gql, {
    ...rest,
    ...getContext({ context, acceptLanguage, authState }),
    ...(variables && { variables }),
    skipCache: true,
    useCache: false
  });
};

export const useAuthenticatedLazyQueryWithVariables = ({ gql, variables }) => {
  const { state } = useContext(AuthContext);
  const { selectedLanguage: { value: acceptLanguage } = {} } = useContext(
    TranslateContext
  );
  const { nagra: { token: nagraToken } = {} } = state || {};

  return useLazyQuery({
    gql,
    context: {
      headers: createHeaders({
        acceptLanguage,
        nagraToken
      })
    },
    variables
  });
};
