import { useContext } from 'react';
import _isBoolean from 'lodash/isBoolean';
import {
  useRefreshMutation,
  useLazyRefreshQuery
} from '#/services/graphql/refreshHooks';
import { AuthContext } from '#/utils/context';
import { createHeaders } from '#/helpers';

import allBookmarksAndFavourites from './allBookmarksAndFavourites.graphql';
import addToWatchlist from './addToWatchlist.graphql';
import addToFavourites from './addToFavourites.graphql';
import removeFromWatchlist from './removeFromWatchlist.graphql';
import watchlistDetails from './watchlistDetails.graphql';
import favouritesDetails from './favouritesDetails.graphql';
import removeFromFavourites from './removeFromFavourites.graphql'; // also available to remove only channel / only program

export const useFavouritesOrWatchlist = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  const [fetchData, { data, ...rest }] = useLazyRefreshQuery({
    gql: allBookmarksAndFavourites,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    },
    notifyOnNetworkStatusChange: true
  });

  const {
    allBookMarksAndFavourites: { bookmarksAndFavorites = [] } = {},
    totalCount
  } = data || {};

  return [
    fetchData,
    {
      data: {
        favouritesOrWatchlist: (bookmarksAndFavorites || []).reduce(
          (acc, curr) => ({ ...acc, [curr?.id]: curr }),
          {}
        ),
        totalCount
      },
      ...rest
    }
  ];
};

export const useFavouriteOrWatchlistState = ({
  isLinearDetails = false,
  id,
  programId,
  channelId
} = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  const variables = isLinearDetails ? { programId, channelId } : { id };

  return useLazyRefreshQuery({
    gql: isLinearDetails ? favouritesDetails : watchlistDetails,
    variables,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    },
    notifyOnNetworkStatusChange: true,
    withRefreshLoading: false
  });
};

const getFavouritesMutation = gql => ({
  channelId,
  programId,
  isChannelPage
} = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  const isRemoveMutation = _isBoolean(isChannelPage);

  return useRefreshMutation({
    gql: isRemoveMutation ? removeFromFavourites : gql,
    variables: {
      channelId,
      programId
    },
    withRefreshLoading: false,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

const getWatchlistMutation = gql => ({ id } = {}) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql,
    variables: {
      id
    },
    withRefreshLoading: false,
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useAddToWatchlist = getWatchlistMutation(addToWatchlist);

export const useRemoveFromWatchlist = getWatchlistMutation(removeFromWatchlist);

export const useAddToFavourites = getFavouritesMutation(addToFavourites);
export const useRemoveFromFavourites = getFavouritesMutation();

export const useToggleFavouriteOrWatchlist = ({
  isLinearDetails,
  isAdded,
  id,
  channelId,
  programId,
  isChannelPage
} = {}) => {
  if (isLinearDetails) {
    const useToggleFavourites = isAdded
      ? useRemoveFromFavourites
      : useAddToFavourites;

    return useToggleFavourites({
      channelId,
      programId,
      ...(isAdded && { isChannelPage })
    });
  }

  const useToggleWatchlist = isAdded
    ? useRemoveFromWatchlist
    : useAddToWatchlist;

  return useToggleWatchlist({ id });
};
