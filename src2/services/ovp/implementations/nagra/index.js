import { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  useQueryWithVariables,
  useLazyQuery
} from '#/services/graphql/useUncachedQuery';
import {
  useLazyRefreshQuery,
  useRefreshQuery
} from '#/services/graphql/refreshHooks';
import ASSET_TYPE_GQL_QUERY from './assetTypeQuery.graphql';
import NAGRA_DETAILS_GQL_QUERY from './nagraDetailsQuery.graphql';
import NAGRA_LAST_PLAYED_EPISODE from './nagraLastPlayedEpisode.graphql';
import NAGRA_DETAILS_LISTING_GQL_QUERY from './nagraDetailsListingQuery.graphql';
import NAGRA_LISTING_GQL_QUERY from './nagraListingQuery.graphql';
import NAGRA_PLAYBACK_GQL_QUERY from './nagraPlaybackQuery.graphql';
import NAGRA_STREAM_URL_GQL_QUERY from './nagraStreamUrl.graphql';
import NAGRA_PLAYER_RECOMMENDATIONS_GQL_QUERY from './nagraPlayerRecommendations.graphql';
import NAGRA_PLAYER_TRACK_ACTIVITY_GQL_MUTATION from './nagraPlayerTrackActivity.graphql';

import { AuthContext } from '#/utils/context';
import { RAIL_SORT } from '#/constants';
import { getDeviceType, DEVICE_TYPE } from '#/utils/getPlatform';
import { createHeaders } from '#/helpers';
import { useDestructureFromAuthContext } from '#/helpers/hooks';

const { chrome, ios } = DEVICE_TYPE;
const isChrome = getDeviceType() === chrome;

export { mockStream, mockVod } from './mockNagraContent';

const getAssetDetailsQuery = (gql = NAGRA_DETAILS_GQL_QUERY) => ({
  id = '',
  hasRefreshCheck = false
}) => {
  const {
    state: {
      isLoggedIn,
      nagra: { token: nagraToken },
      ufinity: { token: ufinityToken }
    } = {}
  } = useContext(AuthContext);

  const useAssetDetailsQuery = hasRefreshCheck
    ? useLazyRefreshQuery
    : useLazyQuery;

  return useAssetDetailsQuery({
    gql,
    variables: {
      id,
      isLoggedIn
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    errorPolicy: 'all'
  });
};

export const useAssetDetails = getAssetDetailsQuery();

export const useLastPlayedEpisode = getAssetDetailsQuery(
  NAGRA_LAST_PLAYED_EPISODE
);

export const useRetrieveAssetType = (id = '') =>
  useRefreshQuery({
    gql: ASSET_TYPE_GQL_QUERY,
    variables: {
      id
    }
  });

export const useRetrieveDetailsListingData = (id = '') =>
  useQueryWithVariables({
    gql: NAGRA_DETAILS_LISTING_GQL_QUERY,
    variables: {
      id
    }
  });

export const useRetrieveListingData = ({ id = '', isAuthenticatedQuery }) => {
  const {
    state: {
      nagra: { token: nagraToken },
      ufinity: { token: ufinityToken }
    } = {}
  } = useContext(AuthContext);

  return useRefreshQuery({
    gql: NAGRA_LISTING_GQL_QUERY,
    variables: {
      id
    },
    ...(isAuthenticatedQuery && {
      context: {
        headers: createHeaders({
          nagraToken
        })
      }
    }),
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    errorPolicy: 'all'
  });
};

export const useRetrieveListingLazyQUery = (id = '') => {
  const {
    state: {
      nagra: { token: nagraToken },
      ufinity: { token: ufinityToken }
    } = {}
  } = useContext(AuthContext);

  return useLazyQuery({
    gql: NAGRA_LISTING_GQL_QUERY,
    variables: {
      id
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    errorPolicy: 'all'
  });
};

export const filterListingData = ({
  filter = '',
  id = '',
  order = RAIL_SORT.A_Z,
  asc = true
}) => {
  const {
    state: {
      nagra: { token: nagraToken },
      ufinity: { token: ufinityToken }
    } = {}
  } = useContext(AuthContext);

  return useLazyQuery({
    gql: NAGRA_LISTING_GQL_QUERY,
    variables: {
      filter,
      id,
      order,
      asc
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};
export const useNagraContentToken = ({ contentId, type }) => {
  const { nagraToken, ufinityToken } = useDestructureFromAuthContext(
    AuthContext
  );

  return useLazyRefreshQuery({
    gql: NAGRA_PLAYBACK_GQL_QUERY,
    variables: {
      contentId,
      type
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};

export const useStreamUrl = ({ idType }) => {
  const { nagraToken } = useDestructureFromAuthContext(AuthContext);

  return useLazyQuery({
    gql: NAGRA_STREAM_URL_GQL_QUERY,
    variables: {
      deviceType: isChrome ? chrome : ios,
      idType
    },
    context: {
      headers: createHeaders({
        nagraToken
      })
    },
    errorPolicy: 'all'
  });
};

export const usePlayerRecommendations = id => {
  const { nagraToken } = useDestructureFromAuthContext(AuthContext);

  return useLazyQuery({
    gql: NAGRA_PLAYER_RECOMMENDATIONS_GQL_QUERY,
    variables: {
      id
    },
    context: {
      headers: createHeaders({
        nagraToken
      })
    }
  });
};

export const usePlayerActivityTracker = ({ activity, contentId }) => {
  const { nagraToken } = useDestructureFromAuthContext(AuthContext);

  return useMutation(NAGRA_PLAYER_TRACK_ACTIVITY_GQL_MUTATION, {
    variables: {
      activity,
      contentId
    },
    context: {
      headers: createHeaders({
        nagraToken
      })
    },
    onError: error => __DEVTOOLS__ && console.warn(error)
  });
};
