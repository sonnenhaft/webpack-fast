import React, { useContext, useCallback, useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';

import {
  useBookmarkPosition,
  useRemoveBookmarkPosition
} from '#/services/player';
import { EpgContext } from '#/utils/context';

import {
  customErrorHandling,
  modifyErrorModal
} from './vjsComponentsHelper/modifyErrorModalHelper';
import { hideAudioSubtitleSelection } from './vjsComponentsHelper/addAudioSubtitleSelectionOverlay';
import { resetPlayPauseButtonState } from './vjsComponentsHelper/addControlsHelper';
import {
  startOver,
  goToLiveButtonControl
} from './vjsComponentsHelper/customPlayerControlsList';

import { usePlayerActivityTracker } from '#/services/ovp/implementations/nagra';
import { noop } from '#/helpers';
import {
  PLAYER_ACTION,
  PLAYER_READY_STATE,
  PLAYER_SEND_PLAY_ACTIVITY_TIMEOUT,
  VJS_CUSTOM_COMPONENTS
} from '#/constants';

import './nagraPlayer.scss';
import './nagraPlayerOverlay.scss';

const MIN_PLAYBACK_TIME = 10;

const { BACK_BUTTON, RECOMMENDATION_RAILS_OVERLAY } = VJS_CUSTOM_COMPONENTS;

const NagraPlayer = ({
  currentEpisodeId,
  dispatchPlayerAction = noop,
  editorialId,
  history = {},
  isMovieDetails,
  isPlayerReplayed,
  isR21,
  loadCurrentLinearDetails = noop,
  messages,
  playerErrors,
  playerInitRef,
  playerInstance,
  playerState = {},
  playerVisibility = false,
  playVideo = noop,
  setContentToken = noop,
  saveVolumePref = noop,
  setPlayerCurrentTime = noop,
  setTimeoutR21PinCheck = noop,
  setTimeoutParentalPinCheck = noop,
  showBingeParentalCheck = {},
  resetStartOverState = noop
}) => {
  const playerIntervalRef = useRef(null);
  const { programSelected = {}, programSelectedInfo = {} } =
    useContext(EpgContext) || {};
  const currentProgram = useRef(null);
  currentProgram.current = { programSelected, programSelectedInfo };
  const showBingeParentalCheckRef = useRef({});
  showBingeParentalCheckRef.current = showBingeParentalCheck;
  const playerStateRef = useRef(null);
  playerStateRef.current = playerState;

  const { state: { routeChange } = {} } = playerInstance || {};

  const createBookmark = useBookmarkPosition(currentEpisodeId || editorialId);
  const [removeBookmark] = useRemoveBookmarkPosition(editorialId);

  const [
    sendPlayActivity,
    { data: { trackActivityForRecommendation } = {} }
  ] = usePlayerActivityTracker({ activity: 'play', contentId: editorialId });
  const playActivityRef = useRef({
    isPlayActivitySent: false,
    timeoutId: null
  });
  playActivityRef.current.isPlayActivitySent =
    trackActivityForRecommendation === 200;
  const clearPlayActivityTimeout = () => {
    const { current: { timeoutId } = {} } = playActivityRef;
    clearTimeout(timeoutId);
    playActivityRef.current.timeoutId = null;
  };

  const removeEventListeners = () => {
    if (playerInstance) {
      playerInstance.off('fullscreenchange');
      playerInstance.off('ssmsetuperror');
      playerInstance.off('error');
      playerInstance.off('ended');
      playerInstance.off('pause');
      playerInstance.off('useractive');
      playerInstance.off('volumechange');
      playerInstance.off('reset');
    }

    clearPlayActivityTimeout();
  };

  const clear = () => {
    clearInterval(playerIntervalRef.current);
    playerIntervalRef.current = null;
  };

  const onPlayerStateChange = useCallback(() => {
    const { state } = playerInstance || {};

    if (
      playerInstance?.readyState?.() === PLAYER_READY_STATE &&
      state?.isStartOver
    ) {
      startOver({ playerInstance });

      clear();
    }
  }, [playerInstance?.readyState?.(), playerVisibility]);

  useEffect(() => {
    const { state } = playerInstance || {};

    if (!playerVisibility || !state?.isStartOver) {
      clear();

      return;
    }

    if (!playerIntervalRef.current) {
      playerIntervalRef.current = setInterval(onPlayerStateChange, 500);
    }
  }, [playerVisibility]);

  // resolution capping
  // TODO to modify to take value from Accedo One
  // playerInstance?.otvtoolkit().setMaxResolution(1920, 1080);
  useEffect(() => {
    if (routeChange) {
      history.push(routeChange);
    }
  }, [routeChange]);

  useEffect(() => {
    if (!playerInstance) {
      return;
    }

    // If playerInstance changed, remove all the event listeners before adding new one
    removeEventListeners();

    // error handling
    playerInstance.on('ssmsetuperror', error => {
      if (error) {
        customErrorHandling({
          messages,
          playerInstance,
          ssmSetupError: error
        });
      }

      if (__DEVTOOLS__) {
        console.warn(error);
      }
    });

    playerInstance.getChild(BACK_BUTTON)?.on('click', () => {
      playerInstance.pause();

      if (Number.isFinite(playerInstance.duration())) {
        playerInstance.setState({
          vodCurrentTime: playerInstance.currentTime()
        });
      }

      if (playerInstance.isFullscreen()) {
        playerInstance.exitFullscreen();
      }

      playVideo(false);
      resetStartOverState();
      const playerCurrentTime = Math.round(playerInstance.currentTime());
      const playerDurationTime = Math.round(playerInstance.duration());
      const timeLeft = Math.abs(playerDurationTime - playerCurrentTime);

      // player session tear down
      playerInstance.reset();

      const recommendationRails = playerInstance?.getChild?.(
        RECOMMENDATION_RAILS_OVERLAY
      );

      if (recommendationRails?.toggleState) {
        recommendationRails?.setToggleState();
      }

      if (
        !isPlayerReplayed &&
        isMovieDetails &&
        playerCurrentTime < playerDurationTime
      ) {
        if (timeLeft <= MIN_PLAYBACK_TIME && timeLeft > 2) {
          removeBookmark();
          setPlayerCurrentTime(0);

          return;
        }

        createBookmark(playerCurrentTime);
        setPlayerCurrentTime(playerCurrentTime);
      }

      setContentToken('');
      // reset play state (needed for setting of currentTime)
      playerInitRef.current = false;

      // remove any existing displayed player error
      const playerErrorDisplay = playerInstance?.errorDisplay;
      const errorDisplayContent = playerErrorDisplay.contentEl_;
      errorDisplayContent.innerHTML = '';
      playerErrorDisplay.hide();

      hideAudioSubtitleSelection(playerInstance);
      resetPlayPauseButtonState(playerInstance);

      clearPlayActivityTimeout();

      // check for current program when player exits full screen
      const {
        current: {
          programSelected: { channelId } = {},
          programSelectedInfo: { endTime } = {}
        } = {}
      } = currentProgram || {};
      if (endTime > 0 && Date.now() > endTime) {
        loadCurrentLinearDetails(channelId);
      }
    });

    playerInstance.on('error', () => {
      playerInstance.reset();
      modifyErrorModal({ messages, playerErrors, playerInstance });
    });

    playerInstance.on('ended', () => {
      const { currentEpisodeIndex, maxEpisodeIndex } =
        playerStateRef.current || {};

      if (currentEpisodeIndex < maxEpisodeIndex) {
        const { next } = showBingeParentalCheckRef.current || {};
        dispatchPlayerAction({
          type: PLAYER_ACTION.nextEpisode,
          hasPinCheck: next
        });
        if (isR21 || next) {
          playerInstance.isFullscreen()
            ? playerInstance.exitFullscreen()
            : null;
          playVideo(true, { showParentalCheck: next });
        }
        removeBookmark();

        return;
      }

      playerInstance.isFullscreen() ? playerInstance.exitFullscreen() : null;
      playVideo(false);

      if (isMovieDetails) {
        removeBookmark();
        setPlayerCurrentTime(0);
      }

      clearPlayActivityTimeout();
    });

    playerInstance.on('pause', () => {
      const playerDurationTime = Math.round(playerInstance.duration());
      const playerCurrentTime = Math.round(playerInstance.currentTime());

      if (isMovieDetails && playerCurrentTime < playerDurationTime) {
        createBookmark(playerCurrentTime);
      }

      if (
        playerInstance.paused() &&
        !playerInstance.seeking() &&
        playerInstance.readyState() === PLAYER_READY_STATE
      ) {
        setTimeoutR21PinCheck(true);
        setTimeoutParentalPinCheck(true);
      }

      clearPlayActivityTimeout();
    });

    playerInstance.on('useractive', () => {
      const {
        current: {
          programSelected: { channelId } = {},
          programSelectedInfo: { endTime } = {}
        } = {}
      } = currentProgram || {};
      if (endTime > 0 && Date.now() > endTime) {
        loadCurrentLinearDetails(channelId);
      }
    });

    playerInstance.on('seeking', () => {
      if (
        Math.abs(
          playerInstance.currentTime() -
            playerInstance.liveTracker?.liveCurrentTime()
        ) < 5
      ) {
        goToLiveButtonControl({ disable: true, playerInstance });
      }
    });

    playerInstance.on('volumechange', () => {
      const volumePref = playerInstance.volume();
      saveVolumePref(volumePref);
    });

    playerInstance.on('play', () => {
      const {
        current: { isPlayActivitySent, timeoutId } = {}
      } = playActivityRef;

      if (!timeoutId && !isPlayActivitySent) {
        playActivityRef.current.timeoutId = setTimeout(() => {
          sendPlayActivity();
          clearPlayActivityTimeout();
        }, PLAYER_SEND_PLAY_ACTIVITY_TIMEOUT);
      }
    });

    return removeEventListeners;
  }, [playerInstance]);

  return (
    <div>
      <video
        className="video-js vjs-default-skin vjs-16-9"
        id="videoPlayer"
        crossOrigin="anonymous"
      />
    </div>
  );
};

NagraPlayer.propTypes = {
  currentEpisodeId: PropTypes.string,
  dispatchPlayerAction: PropTypes.func,
  editorialId: PropTypes.string,
  history: PropTypes.object,
  isMovieDetails: PropTypes.bool,
  isPlayerReplayed: PropTypes.bool,
  isR21: PropTypes.bool,
  loadCurrentLinearDetails: PropTypes.func,
  messages: PropTypes.object,
  playerErrors: PropTypes.object,
  playerInitRef: PropTypes.shape({
    current: PropTypes.bool
  }),
  playerInstance: PropTypes.object,
  playerState: PropTypes.object,
  playVideo: PropTypes.func,
  playerVisibility: PropTypes.bool,
  resetStartOverState: PropTypes.func,
  saveVolumePref: PropTypes.func,
  setContentToken: PropTypes.func,
  setPlayerCurrentTime: PropTypes.func,
  setTimeoutR21PinCheck: PropTypes.func,
  setTimeoutParentalPinCheck: PropTypes.func,
  showBingeParentalCheck: PropTypes.shape({
    next: PropTypes.bool,
    prev: PropTypes.bool
  })
};

export default React.memo(NagraPlayer, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
);
