import { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { createHeaders } from '#/helpers';
import {
  useLazyRefreshQuery,
  useRefreshMutation
} from '#/services/graphql/refreshHooks';
import { AuthContext } from '#/utils/context';

import isPinValidQuery from './isPinValid.graphql';
import resetR21Pin from './resetR21Pin.graphql';
import r21PinQuery from './r21PinQuery.graphql';
import r21EmailResetPin from './r21SendEmailToReset.graphql';
import changePinMutation from './changePinMutation.graphql';

export const useResetPin = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useMutation(resetR21Pin, {
    context: {
      headers: {
        'x-sh-n': nagraToken,
        'x-sh-u': ufinityToken
      }
    }
  });
};

export const useIsPinValid = ({ withRefreshLoading = true } = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    withRefreshLoading,
    gql: isPinValidQuery,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};

export const useChangePin = ({
  currentPin,
  newPin,
  withRefreshLoading = true
} = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: changePinMutation,
    withRefreshLoading,
    variables: {
      currentPin,
      newPin
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};

export const useR21Pin = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useLazyRefreshQuery({
    gql: r21PinQuery,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    errorPolicy: 'all'
  });
};

export const useSendR21EmailReset = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: r21EmailResetPin,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};
