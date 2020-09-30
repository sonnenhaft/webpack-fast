import { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import {
  getContext,
  useLazyQuery,
  useQueryWithVariables
} from '#/services/graphql/useUncachedQuery';
import { AuthContext } from '#/utils/context';
import { createHeaders } from '#/helpers';
import MULTI_PACK_DETAILS_QUERY from './multiPackDetailsQuery.graphql';
import PURCHASE_MUTATION from './purchaseMutation.graphql';
import PACK_DETAILS_QUERY from './packDetailsQuery.graphql';
import { useHistory } from 'react-router';
import { useDestructureFromAuthContext } from '#/helpers/hooks';
import { ROUTE } from '#/constants';

export const usePackDetails = ({ packId = '', isLoggedIn }) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useLazyQuery({
    gql: PACK_DETAILS_QUERY,
    variables: {
      isLoggedIn,
      packId
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};

const { LOGIN } = ROUTE;

export const useRedirectToLogin = () => {
  const history = useHistory();
  const { isLoggedIn } = useDestructureFromAuthContext(AuthContext);

  return {
    redirectToLogin: () => history.push(`${LOGIN}?activated`),
    isLoggedIn
  };
};

export const usePurchaseMutation = () => {
  const { state: authState } = useContext(AuthContext);

  const {
    nagra: { token: nagraToken } = {},
    ufinity: { token: ufinityToken } = {}
  } = authState;
  const context = {
    headers: createHeaders({
      nagraToken,
      ufinityToken
    })
  };

  return useMutation(PURCHASE_MUTATION, getContext({ context, authState }));
};

export const useMultiPackDetails = (id = '') => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useQueryWithVariables({
    gql: MULTI_PACK_DETAILS_QUERY,
    variables: {
      id
    },
    errorPolicy: 'all',
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};
