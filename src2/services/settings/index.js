import { useContext } from 'react';
import {
  useRefreshMutation,
  useLazyRefreshQuery,
  useRefreshQuery
} from '#/services/graphql/refreshHooks';
import { useUncachedQuery } from '#/services/graphql/useUncachedQuery';
import { AuthContext } from '#/utils/context';
import { createHeaders } from '#/helpers';

import settingsQuery from './settingsQuery.graphql';
import parentalPinSettings from './parentalPinSettings.graphql';
import enableParentalPinSettings from './enableParentalPinSettings.graphql';
import disableParentalPinSettings from './disableParentalPinSettings.graphql';
import parentalRating from './parentalRating.graphql';
import addParentalRating from './addParentalRating.graphql';
import userSettings from './userSettings.graphql';
import parentalRestrictedChannels from './parentalRestrictedChannels.graphql';
import restrictChannelsMutation from './restrictChannels.graphql';
import allowChannelsMutation from './allowChannels.graphql';
import allChannels from './allChannels.graphql';
import sendParentalResetEmail from './sendParentalResetEmail.graphql';
import isParentalPinValid from './isParentalPinValid.graphql';
import changeParentalPin from './changeParentalPin.graphql';
import parentalSettingsDetailsPage from './parentalSettingsDetailsPage.graphql';

const toggleChannelsMutation = gql => (channelIds = []) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql,
    variables: {
      channelIds
    },
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useToggleParentalSetting = ({
  settingName,
  currentValue
} = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: currentValue ? disableParentalPinSettings : enableParentalPinSettings,
    variables: {
      settingName
    },
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useSettings = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshQuery({
    gql: settingsQuery,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    },
    notifyOnNetworkStatusChange: true
  });
};

export const useParentalSettings = ({ isLazy = false } = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  const useQuery = isLazy ? useLazyRefreshQuery : useRefreshQuery;

  return useQuery({
    gql: parentalPinSettings,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    },
    isCombinedLoading: false,
    notifyOnNetworkStatusChange: true
  });
};

export const useParentalSettingsDetailsPage = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useLazyRefreshQuery({
    gql: parentalSettingsDetailsPage,
    isCombinedLoading: false,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useParentalRating = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshQuery({
    gql: parentalRating,
    isCombinedLoading: false,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useRestrictChannels = toggleChannelsMutation(
  restrictChannelsMutation
);

export const useAllowChannels = toggleChannelsMutation(allowChannelsMutation);

export const useAllChannels = () => {
  return useUncachedQuery({ gql: allChannels });
};

export const useRestrictedChannels = ({ isLazy = false } = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  const useQuery = isLazy ? useLazyRefreshQuery : useRefreshQuery;

  return useQuery({
    gql: parentalRestrictedChannels,
    isCombinedLoading: false,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useSendResetEmail = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: sendParentalResetEmail,
    withRefreshLoading: false,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useAddParentalRating = ({ ratingCode = '' } = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: addParentalRating,
    variables: {
      ratingCode
    },
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useParentalPinValid = ({ currentPin = '' } = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: isParentalPinValid,
    variables: {
      currentPin
    },
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useChangeParentalPin = ({ currentPin, newPin } = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: changeParentalPin,
    variables: {
      currentPin,
      newPin
    },
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useHasEmail = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useLazyRefreshQuery({
    gql: userSettings,
    withRefreshLoading: false,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};
