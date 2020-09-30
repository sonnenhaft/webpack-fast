import { useContext, useEffect, useReducer } from 'react';

import { PLAYER_ACTION } from '#/constants';
import { showParentalCheckHelper } from './usePinHook';
import { useBookmarkPosition } from '#/services/player';
import { PlayerContext } from '#/utils/context';

const {
  bingeWatch,
  nextEpisode,
  prevEpisode,
  resetState,
  setInitialEpisodeIndex
} = PLAYER_ACTION;

const playerInitialState = {
  currentEpisodeIndex: null,
  prevWatchedEpisodeIndex: null,
  isBingeWatching: false,
  isNewEpisodePlayed: false,
  maxEpisodeIndex: null,
  showParentalCheck: false,
  type: null
};

const playerReducer = (
  state = playerInitialState,
  { initialEpisodeIndex, initialMaxEpisodeIndex, showParentalCheck, type }
) => {
  const { currentEpisodeIndex, maxEpisodeIndex } = state || {};
  switch (type) {
    case nextEpisode:
    case prevEpisode: {
      if (
        (currentEpisodeIndex === 0 && type === prevEpisode) ||
        (currentEpisodeIndex === maxEpisodeIndex && type === nextEpisode) ||
        maxEpisodeIndex < 0
      ) {
        return state;
      }
      const newEpisodeIndex =
        type === nextEpisode
          ? currentEpisodeIndex + 1
          : currentEpisodeIndex - 1;

      return {
        ...state,
        currentEpisodeIndex: newEpisodeIndex,
        prevWatchedEpisodeIndex: currentEpisodeIndex,
        isBingeWatching: true,
        isNewEpisodePlayed: true,
        showParentalCheck,
        type
      };
    }

    case bingeWatch:
      return { ...state, isNewEpisodePlayed: false, type };

    case setInitialEpisodeIndex:
      return {
        ...state,
        currentEpisodeIndex: initialEpisodeIndex,
        prevWatchedEpisodeIndex: null,
        maxEpisodeIndex: initialMaxEpisodeIndex,
        type
      };

    case resetState:
      return playerInitialState;

    default:
      return state;
  }
};

export const useResumeWatchHelper = ({
  episodes,
  lastPlayedEpisodeWithoutSeason,
  lastPlayedSeason,
  seasons
}) => {
  const { episodeNumber: savedEpisodeNumber, seasonNumber: savedSeasonNumber } =
    lastPlayedSeason?.lastPlayedEpisode || {};
  // without seasons
  const { episodeNumber: savedEpisodeNumberWithoutSeason } =
    lastPlayedEpisodeWithoutSeason || {};

  const [filteredSeason] =
    (seasons || []).filter(season => {
      const { seasonNumber } = season || {};

      return seasonNumber === savedSeasonNumber;
    }) || [];

  const { episodes: filteredSeasonEpisodes = [] } = filteredSeason || {};
  const [filteredEpisode] =
    filteredSeasonEpisodes.filter(episode => {
      const { episodeNumber } = episode || {};

      return episodeNumber === savedEpisodeNumber;
    }) || [];

  const { id: lastPlayedId } = filteredEpisode || {};

  // without seasons
  const [filteredEpisodeWithoutSeason] =
    (episodes || []).filter(episode => {
      const { episodeNumber } = episode || {};

      return episodeNumber === savedEpisodeNumberWithoutSeason;
    }) || [];

  const { id: lastPlayedIdWithoutSeason } = filteredEpisodeWithoutSeason || {};

  return lastPlayedId || lastPlayedIdWithoutSeason;
};

export const useBingeWatchHelper = ({
  editorialId,
  episodes = [],
  parentalSettingsData
}) => {
  const [playerState, dispatchPlayerAction] = useReducer(
    playerReducer,
    playerInitialState
  );

  const { prevWatchedEpisodeIndex, currentEpisodeIndex } = playerState || {};
  const prevEpisodeId = (episodes && episodes[prevWatchedEpisodeIndex])?.id;
  const createBookmark = useBookmarkPosition(prevEpisodeId);
  const { playerInstanceFromContext } = useContext(PlayerContext);
  useEffect(() => {
    if (prevEpisodeId && playerInstanceFromContext) {
      const playerCurrentTime = Math.round(
        playerInstanceFromContext.currentTime()
      );
      createBookmark(playerCurrentTime);
    }
  }, [prevEpisodeId, playerInstanceFromContext]);

  const showBingeParentalCheckHelper = episode => {
    const { rating } = episode || {};

    return showParentalCheckHelper({ parentalSettingsData, rating });
  };

  const initialEpisodeIndex = episodes.findIndex(
    ({ id }) => id === editorialId
  );

  useEffect(() => {
    dispatchPlayerAction({
      initialEpisodeIndex,
      initialMaxEpisodeIndex: episodes.length - 1,
      type: setInitialEpisodeIndex
    });
  }, [editorialId]);

  useEffect(() => {
    dispatchPlayerAction({
      initialEpisodeIndex,
      initialMaxEpisodeIndex: episodes?.length ? episodes.length - 1 : 0,
      type: setInitialEpisodeIndex
    });
    if (!episodes?.length) {
      dispatchPlayerAction({
        type: resetState
      });
    }
  }, [episodes]);

  const {
    episodeNumberAndTitle: currentEpisodeNumberAndTitle,
    id: currentEpisodeId
  } = episodes[currentEpisodeIndex] || {};

  const nextBingeEpisode = episodes?.[currentEpisodeIndex + 1];
  const prevBingeEpisode = episodes?.[currentEpisodeIndex - 1];

  const showBingeParentalCheck = {
    next: showBingeParentalCheckHelper(nextBingeEpisode),
    prev: showBingeParentalCheckHelper(prevBingeEpisode)
  };

  return {
    dispatchPlayerAction,
    currentEpisodeId,
    currentEpisodeIndex,
    hasBingeWatch: Boolean(episodes?.length),
    currentEpisodeNumberAndTitle,
    showBingeParentalCheck,
    playerState
  };
};
