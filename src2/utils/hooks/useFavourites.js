import { useEffect, useContext } from 'react';

import {
  useFavouriteOrWatchlistState,
  useToggleFavouriteOrWatchlist
} from '#/services/watchlist';

import { AuthContext } from '#/utils/context';

import { useLoadingComplete } from './useLoadingComplete';

const useFavourites = ({
  isLinearDetails,
  programId,
  channelId,
  id,
  isEpgPage = false
} = {}) => {
  const { state: { isLoggedIn } = {} } = useContext(AuthContext);
  const [fetchData, { data }] = useFavouriteOrWatchlistState({
    isLinearDetails,
    programId,
    channelId,
    id
  });

  const { details, channel, program } = data || {};

  const isChannelPage = channelId === id;

  const isLinearFavourite = isChannelPage
    ? channel?.inFavorites
    : program?.inFavorites;

  const isFavourite = isLinearDetails
    ? isLinearFavourite
    : details?.inFavorites;

  const hasIds = isLinearDetails ? programId && channelId : id;

  useEffect(() => {
    if (isLoggedIn && hasIds && !isEpgPage) {
      fetchData();
    }
  }, [isLoggedIn, hasIds]);

  const [
    toggleFavOrWatchlist,
    { loading: toggleFavLoading }
  ] = useToggleFavouriteOrWatchlist({
    isLinearDetails,
    isChannelPage,
    id,
    isAdded: isFavourite,
    channelId,
    programId
  });

  useLoadingComplete({
    loading: toggleFavLoading,
    onComplete: fetchData
  });

  return [
    toggleFavOrWatchlist,
    {
      toggleFavLoading,
      isFavourite: isLinearDetails ? isLinearFavourite : details?.inFavorites,
      fetchFavouriteState: fetchData
    }
  ];
};

export { useFavourites };
