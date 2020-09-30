import React from 'react';
import classNames from 'classnames';

import { toggleAudioSubtitleSelection } from './addAudioSubtitleSelectionOverlay';
import { toggleRecommendationRailsOverlay } from './addRecommendationRailsHelper';
import {
  EpisodesIcon,
  FullscreenIcon,
  GoToLiveIcon,
  NextEpisodeIcon,
  PauseIcon,
  PlayIcon,
  PrevEpisodeIcon,
  StartOverIcon,
  SubtitleAudioIcon,
  VolumeIcon,
  VolumeMuteIcon
} from '#/components/Icons';
import {
  PLAYER_ACTION,
  VJS_CUSTOM_CLASSNAMES,
  VJS_CUSTOM_COMPONENTS
} from '#/constants';
import { isStreamDurationFinite, noop } from '#/helpers';
import { isLiveHelper, ONE_HOUR_IN_MS } from '#/helpers/timeHelpers';

import FavouritePlayerIcon from './FavouritePlayerIcon';
import { iconContainer, iconStyle } from '../nagraPlayer.scss';

const {
  episodesOrRecommendations,
  favourite,
  fullscreen,
  goToLiveClass,
  nextEpisode,
  playPause,
  prevEpisode,
  subtitleAndAudio,
  startOverClass,
  volume
} = VJS_CUSTOM_CLASSNAMES;

const { BACK_BUTTON, CONTROL_BAR } = VJS_CUSTOM_COMPONENTS;

const playIconClass = classNames('vjs-custom-secondary-btn', iconContainer);

export const goToLiveButtonControl = ({ disable = false, playerInstance }) => {
  if (!playerInstance) {
    return;
  }

  const controlBarChildren = playerInstance.getChild(CONTROL_BAR)?.children();
  const goToLiveButton = controlBarChildren?.[4];
  goToLiveButton?.disableButton(disable);
};

const play = ({ maximumTimeShiftHours, playerInstance = {} }) => {
  if (!playerInstance) {
    return;
  }
  const { liveTracker, state } = playerInstance || {};

  if (playerInstance.paused()) {
    const { pausedTimestamp } = state || {};
    const isMaxTimeShiftExceeded =
      Date.now() - pausedTimestamp > maximumTimeShiftHours * ONE_HOUR_IN_MS;

    if (!isStreamDurationFinite(playerInstance) && isMaxTimeShiftExceeded) {
      const liveCurrentTime = liveTracker?.liveCurrentTime();
      playerInstance.currentTime(liveCurrentTime);
    }

    playerInstance.play();

    return;
  }

  playerInstance.pause();
  playerInstance.setState?.({
    ...state,
    pausedTimestamp: Date.now()
  });

  if (!isStreamDurationFinite(playerInstance)) {
    goToLiveButtonControl({ disable: false, playerInstance });
    playerInstance?.off('play', playerInstance.liveTracker?.handlePlay);
  }
};

const bingeWatchWithPinCheck = ({
  isR21,
  playerInstance = {},
  playVideo = noop,
  showParentalCheck
}) => {
  if (!playerInstance) {
    return;
  }

  if (isR21 || showParentalCheck) {
    playerInstance.getChild(BACK_BUTTON).trigger('click');
    playVideo(true, { showParentalCheck });
  }
};

const playNextEpisode = ({
  dispatchPlayerAction = noop,
  isR21,
  playerInstance,
  playVideo
}) => {
  const { state } = playerInstance || {};
  const { showBingeParentalCheck: { next } = {} } = state || {};
  dispatchPlayerAction({
    type: PLAYER_ACTION.nextEpisode,
    showParentalCheck: next
  });

  bingeWatchWithPinCheck({
    isR21,
    playerInstance,
    playVideo,
    showParentalCheck: next
  });
};

const playPrevEpisode = ({
  dispatchPlayerAction = noop,
  isR21,
  playerInstance = {},
  playVideo
}) => {
  const { state } = playerInstance || {};
  const { showBingeParentalCheck: { prev } = {} } = state || {};
  dispatchPlayerAction({
    type: PLAYER_ACTION.prevEpisode,
    showParentalCheck: prev
  });

  bingeWatchWithPinCheck({
    isR21,
    playerInstance,
    playVideo,
    showParentalCheck: prev
  });
};

export const startOver = ({ playerInstance }) => {
  if (!playerInstance) {
    return;
  }

  const { state: { elapsedDuration } = {} } = playerInstance || {};

  playerInstance.currentTime?.(elapsedDuration || 0);
  goToLiveButtonControl({ disable: false, playerInstance });
};

const goToLive = ({ playerInstance }) => {
  if (!playerInstance) {
    return;
  }
  const liveCurrentTime = playerInstance.liveTracker?.liveCurrentTime();
  playerInstance.currentTime?.(liveCurrentTime);
  goToLiveButtonControl({ disable: true, playerInstance });
};

const toggleFullScreen = ({ playerInstance }) =>
  playerInstance.isFullscreen()
    ? playerInstance.exitFullscreen()
    : playerInstance.requestFullscreen();

export const getPlayerControlsList = ({
  isVod,
  messages = {},
  playerInstance
}) => {
  const {
    moreLikeThisText,
    playerAudioSub,
    playerBackToLive,
    playerNextEps,
    playerPause,
    playerPlay,
    playerPreviousEps,
    playerStartOver,
    playerVolume,
    vodWatchlistButtonTitle,
    linearWatchlistButtonTitle
  } = messages;
  const {
    state: {
      programSelectedInfo: {
        isCatchUpSupported,
        startOverSupport,
        endTime: end,
        startTime: start
      } = {}
    } = {}
  } = playerInstance || {};
  const hasVodControls = isVod && !isCatchUpSupported;

  const isLive = isLiveHelper({
    end,
    start
  });
  const isCatchUp = !isLive && isCatchUpSupported;
  const shouldShowStartOver = isLive && startOverSupport;
  const noTimeshift = !isVod && !isCatchUpSupported && !startOverSupport;

  const { favouriteBtnControls: { isLinearDetails } = {} } =
    playerInstance?.state || {};

  const prevEpisodeButton = {
    buttonFunction: playPrevEpisode,
    className: prevEpisode,
    iconSrc: <PrevEpisodeIcon iconStyle={iconStyle} />,
    label: playerPreviousEps,
    disabled: false
  };

  const nextEpisodeButton = {
    buttonFunction: playNextEpisode,
    className: nextEpisode,
    iconSrc: <NextEpisodeIcon iconStyle={iconStyle} />,
    label: playerNextEps,
    disabled: false
  };

  const startOverButton = {
    buttonFunction: startOver,
    className: startOverClass,
    iconSrc: <StartOverIcon iconStyle={iconStyle} />,
    label: playerStartOver,
    disabled: isCatchUp || !shouldShowStartOver
  };

  const backToLiveButton = {
    buttonFunction: goToLive,
    className: goToLiveClass,
    iconSrc: <GoToLiveIcon iconStyle={iconStyle} />,
    label: playerBackToLive,
    disabled: isCatchUp || (isVod && isCatchUpSupported) || !isVod
  };

  return [
    {
      className: subtitleAndAudio,
      iconSrc: <SubtitleAudioIcon />,
      buttonFunction: toggleAudioSubtitleSelection,
      label: playerAudioSub
    },
    {
      className: favourite,
      iconSrc: (
        <FavouritePlayerIcon
          playerInstance={playerInstance}
          iconContainer={iconContainer}
          iconStyle={iconStyle}
        />
      ),
      label: isLinearDetails
        ? linearWatchlistButtonTitle
        : vodWatchlistButtonTitle
    },
    hasVodControls ? prevEpisodeButton : startOverButton,
    {
      className: playPause,
      iconSrc: (
        <PauseIcon className="vjs-custom-primary-btn" iconStyle={iconStyle} />
      ),
      secondaryIconSrc: (
        <PlayIcon iconContainer={playIconClass} iconStyle={iconStyle} />
      ),
      buttonFunction: hasVodControls || !noTimeshift ? play : noop,
      disabled: noTimeshift,
      label: playerPause,
      secondaryLabel: playerPlay
    },
    hasVodControls ? nextEpisodeButton : backToLiveButton,
    {
      buttonFunction: toggleRecommendationRailsOverlay,
      className: episodesOrRecommendations,
      iconSrc: <EpisodesIcon iconStyle={iconStyle} />,
      label: moreLikeThisText
    },
    {
      className: volume,
      iconSrc: <VolumeIcon className="vjs-custom-primary-btn" />,
      secondaryIconSrc: <VolumeMuteIcon className="vjs-custom-secondary-btn" />,
      label: playerVolume
    },
    {
      className: fullscreen,
      iconSrc: <FullscreenIcon iconStyle={iconStyle} />,
      label: 'Fullscreen',
      buttonFunction: toggleFullScreen
    }
  ];
};
