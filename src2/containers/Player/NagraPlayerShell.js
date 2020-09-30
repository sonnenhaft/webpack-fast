import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import _isBoolean from 'lodash/isBoolean';

import {
  AuthContext,
  ConfigContext,
  PlayerContext,
  UserPrefContext
} from '#/utils/context';
import NagraPlayer from './NagraPlayer';
import { useNagraContentToken } from '#/services/ovp/implementations/nagra';
import { getDeviceType, DEVICE_TYPE } from '#/utils/getPlatform';
import { usePrevValue } from '#/utils/hooks';
import { getDrmConfig, setDrmSystem } from './drmHelper';
import {
  addBackButtonToPlayer,
  addComponentsToPlayer,
  addErrorPrompt,
  disableControlBarButton,
  removeBackButtonToPlayer,
  removeComponentsToPlayer
} from './vjsComponentsHelper/addComponentsToPlayerHelper';
import { customErrorHandling } from './vjsComponentsHelper/modifyErrorModalHelper';
import { changeTextLabel } from './vjsComponentsHelper/modifyTextLabelHelper';
import {
  constructLinearQueue,
  modifyLinearQueue
} from '#/views/EpgPage/getCurrentLinearProgramHelper';
import {
  EPG_PLAYER_ACTION,
  PLAYER_ACTION,
  PLAYER_INACTIVITY_TIMEOUT,
  ON_FAVOURITE_CHANGE,
  ON_RECOMMENDATION_CHANGE
} from '#/constants';
import {
  isStreamDurationFinite,
  noop,
  createAndDispatchEvent
} from '#/helpers';

const { LICENSE_KEY } = __ENV_CONFIG__;

const isChrome = getDeviceType() === DEVICE_TYPE.chrome;
const { playerStartReplay } = EPG_PLAYER_ACTION;

const NagraPlayerShell = ({
  isEpgPage = false,
  currentEpisodeId,
  dispatchPlayerAction,
  editorialId,
  episodeNumberAndTitle,
  epgPlayerDispatch = noop,
  hasBingeWatch,
  history,
  isMovieDetails,
  isPlayerReplayed,
  isR21,
  loadCurrentLinearDetails = noop,
  playerState,
  playerWatchedPosition,
  playVideo,
  playerVisibility,
  programSelectedInfo = {},
  recommendations,
  setPlayerCurrentTime = noop,
  setPlayerReplayed = noop,
  setTimeoutR21PinCheck = noop,
  setTimeoutParentalPinCheck = noop,
  showBingeParentalCheck = {},
  favouriteBtnControls,
  streamUrl,
  title,
  ...rest
}) => {
  const [contentToken, setContentToken] = useState('');
  const { playerInstanceFromContext, setPlayerInstanceToContext } = useContext(
    PlayerContext
  );
  const {
    languageMap,
    maximumTimeShiftHours,
    messages,
    playerErrors
  } = useContext(ConfigContext);
  const { saveVolumePref } = useContext(UserPrefContext);
  const { state: { entitlements } = {} } = useContext(AuthContext);
  const { startTime } = programSelectedInfo || {};
  const isPlayerReplayedRef = useRef(false);
  const isNewEpisodePlayedRef = useRef(false);
  const [prevSrc, setPrevSrc] = usePrevValue(null);

  const { drmID: drmId, uri } = streamUrl || {};
  const sourceType = isChrome
    ? 'application/dash+xml'
    : 'application/x-mpegURL';
  const {
    currentEpisodeIndex,
    isNewEpisodePlayed,
    maxEpisodeIndex,
    showParentalCheck
  } = playerState || {};
  isNewEpisodePlayedRef.current = isNewEpisodePlayed;

  // this is to avoid re-creation of player and the re-using of content token to load timeshift channel url with updated querystring
  const isNewProgramOnTheSameChannel =
    !(streamUrl?.uri === prevSrc) && // not user reloading player / pin popup
    !streamUrl?.uri?.includes('end') && // not timeshift catchup program
    streamUrl?.uri?.split('?')[0] === prevSrc?.split('?')[0]; // querystring param begin is updated but still the same channel

  const [
    lazyloadContentToken,
    { data: contentTokenData, error: nagraContentTokenError }
  ] = useNagraContentToken({
    type: 'device'
  });

  const { contentToken: nagraContentToken } =
    contentTokenData?.nagraContentTokenData || {};
  const drmConfig = getDrmConfig();

  const onCreationFailureCallback = creationError => {
    // TODO replace with better error handling
    console.warn(`player error:${creationError}`);
  };

  const playerInitRef = useRef(false);
  const playerWatchedPositionRef = useRef(null);

  useEffect(() => {
    playerWatchedPositionRef.current = playerWatchedPosition;
  }, [playerWatchedPosition]);

  useEffect(() => {
    if (playerInstanceFromContext) {
      const { state } = playerInstanceFromContext || {};
      const { isFavourite } = favouriteBtnControls || {};

      if (_isBoolean(isFavourite)) {
        createAndDispatchEvent(ON_FAVOURITE_CHANGE, { isFavourite });
      }

      playerInstanceFromContext?.setState?.({
        ...state,
        favouriteBtnControls
      });
    }
  }, [favouriteBtnControls?.isFavourite, playerInstanceFromContext]);

  // load SDK
  useEffect(() => {
    if (playerInstanceFromContext) {
      playerInstanceFromContext.off('canplay');
    }

    if (isNewProgramOnTheSameChannel) {
      return;
    }
    const drmSystem = setDrmSystem(drmConfig);
    const playerInstance =
      streamUrl &&
      otvplayer(
        'videoPlayer',
        {
          html5: {
            nativeCaptions: !isChrome,
            nativeAudioTracks: !isChrome
          },
          plugins: {
            otvtoolkit: {
              licence: LICENSE_KEY,
              creationFailureCallback: onCreationFailureCallback,
              ...(drmId && { drm: drmSystem })
            }
          }
        },
        () => {
          setPlayerInstanceToContext(playerInstance);
          if (!drmId) {
            playerInstance.otvtoolkit();
          }

          playerInstance.options_.inactivityTimeout = PLAYER_INACTIVITY_TIMEOUT;

          playerInstance?.otvtoolkit().networkStatistics.setNetworkListener({
            errorChanged: e => {
              playerInstance.error(e);
            }
          });

          playerInstance.on('canplay', () => {
            if (isPlayerReplayedRef.current) {
              playerInstance.play();
              isPlayerReplayedRef.current = false;
            }
            addComponentsToPlayer({
              currentEpisodeIndex,
              dispatchPlayerAction,
              episodeNumberAndTitle,
              isR21,
              languageMap,
              maxEpisodeIndex,
              maximumTimeShiftHours,
              messages,
              playerInstance,
              playVideo,
              title: title || '',
              favouriteBtnControls,
              videojs
            });

            // resume watch for Safari browser
            if (!playerInitRef.current && !isChrome) {
              playerInitRef.current = true;
              if (isStreamDurationFinite(playerInstance)) {
                if (isNewEpisodePlayedRef.current) {
                  playerInstance.currentTime(0);

                  return;
                }
                playerInstance.currentTime(playerWatchedPositionRef.current);

                return;
              }

              const { state } = playerInstance || {};
              const { lastSavedLiveCurrentTime } = state || {};
              if (lastSavedLiveCurrentTime) {
                playerInstance.currentTime(lastSavedLiveCurrentTime);
              }
            }
          });
          addBackButtonToPlayer({ playerInstance, videojs });
          addErrorPrompt(videojs);
        }
      );
  }, [streamUrl]);

  // load content token
  useEffect(() => {
    if (drmId && playerVisibility && (!contentToken || isNewEpisodePlayed)) {
      lazyloadContentToken({
        variables: {
          contentId: drmId
        }
      });
    }
  }, [drmId, playerVisibility]);

  useEffect(() => {
    if (nagraContentToken) {
      setContentToken(nagraContentToken);
    }
  }, [nagraContentToken]);

  useEffect(() => {
    if (prevSrc && streamUrl?.uri && recommendations) {
      createAndDispatchEvent(ON_RECOMMENDATION_CHANGE, { recommendations });
    }

    if (isEpgPage) {
      setPrevSrc(streamUrl?.uri);
    }
  }, [streamUrl?.uri, recommendations]);

  // load playable source to player
  useEffect(() => {
    const source = {
      src: uri,
      type: sourceType,
      ...(drmId && { token: contentToken })
    };

    if (playerVisibility) {
      if ((drmId && contentToken) || (!drmId && uri)) {
        // playing source for the first time
        if (!playerInstanceFromContext?.currentSrc()) {
          playerInstanceFromContext?.src(source);
          playerInstanceFromContext?.setState({
            entitlements,
            linearQueue: constructLinearQueue({
              playerInstance: playerInstanceFromContext,
              programSelectedInfo
            }),
            recommendations,
            programSelectedInfo,
            showBingeParentalCheck
          });
          modifyLinearQueue({
            playerInstance: playerInstanceFromContext,
            startTime
          });
        }

        // subsequent playing of source
        if (
          playerInstanceFromContext?.currentSrc() &&
          isPlayerReplayed &&
          !isNewEpisodePlayed
        ) {
          epgPlayerDispatch({ type: playerStartReplay });
          setPlayerReplayed(false);
          isNewProgramOnTheSameChannel
            ? null
            : playerInstanceFromContext.src(source);
          isPlayerReplayedRef.current = true;

          const { state } = playerInstanceFromContext || {};
          const { lastSavedLiveCurrentTime } = state || {};
          if (lastSavedLiveCurrentTime) {
            modifyLinearQueue({
              playerInstance: playerInstanceFromContext,
              resumeLive: true
            });
          }
          playerInstanceFromContext.setState({
            ...state,
            programSelectedInfo
          });
        }

        // resume watch for non-Safari browsers
        if (
          (!playerInstanceFromContext?.currentSrc() ||
            (playerInstanceFromContext?.currentSrc() && isPlayerReplayed)) &&
          isChrome &&
          !isNewEpisodePlayed
        ) {
          const resumeTime =
            playerInstanceFromContext.state.vodCurrentTime ||
            playerWatchedPositionRef.current;
          if (playerWatchedPositionRef.current) {
            playerInstanceFromContext?.currentTime(resumeTime);
          } else {
            const { state } = playerInstanceFromContext.current || {};
            const { lastSavedLiveCurrentTime } = state || {};
            if (lastSavedLiveCurrentTime) {
              modifyLinearQueue({
                playerInstance: playerInstanceFromContext,
                resumeLive: true
              });
              playerInstanceFromContext.currentTime(lastSavedLiveCurrentTime);

              return;
            }

            modifyLinearQueue({
              playerInstance: playerInstanceFromContext,
              startTime
            });
          }
        }
      }
    }
  }, [contentToken, uri, playerInstanceFromContext, playerVisibility]);

  useEffect(() => {
    const source = {
      src: uri,
      type: sourceType,
      ...(drmId && { token: contentToken })
    };
    const sourceCheck = drmId && contentToken;

    if (
      playerInstanceFromContext?.currentSrc() &&
      isNewEpisodePlayed &&
      sourceCheck
    ) {
      playerInstanceFromContext?.reset();
      playerInstanceFromContext?.src(source);
      playerInstanceFromContext?.play();
      dispatchPlayerAction({ type: PLAYER_ACTION.bingeWatch });

      changeTextLabel({
        episodeNumberAndTitle,
        messages,
        playerInstance: playerInstanceFromContext,
        title
      });
      disableControlBarButton({
        currentEpisodeIndex,
        hasBingeWatch,
        maxEpisodeIndex,
        playerInstance: playerInstanceFromContext
      });
    }
  }, [contentToken]);

  useEffect(() => {
    if (playerInstanceFromContext) {
      const { state } = playerInstanceFromContext || {};
      playerInstanceFromContext.setState?.({
        ...state,
        showBingeParentalCheck
      });
    }
  }, [showBingeParentalCheck]);

  // teardown
  useEffect(() => {
    return () => {
      if (playerInstanceFromContext) {
        removeBackButtonToPlayer(playerInstanceFromContext);
        removeComponentsToPlayer(playerInstanceFromContext);

        playerInstanceFromContext.off('canplay');
        playerInstanceFromContext.off('play');
        playerInstanceFromContext.off('volumechange');
        playerInstanceFromContext.dispose();
        setPlayerInstanceToContext(null);
      }
    };
  }, [playerInstanceFromContext]);

  // error handling
  useEffect(() => {
    customErrorHandling({
      dispatchPlayerAction,
      messages,
      nagraContentTokenError,
      playerInstance: playerInstanceFromContext,
      playerState,
      streamUrl
    });
  }, [nagraContentTokenError, playerInstanceFromContext, streamUrl]);

  return (
    <div>
      <NagraPlayer
        {...rest}
        currentEpisodeId={currentEpisodeId}
        dispatchPlayerAction={dispatchPlayerAction}
        editorialId={editorialId}
        history={history}
        isMovieDetails={isMovieDetails}
        isPlayerReplayed={isPlayerReplayed}
        isR21={isR21}
        loadCurrentLinearDetails={loadCurrentLinearDetails}
        messages={messages}
        playerErrors={playerErrors}
        playerInitRef={playerInitRef}
        playerInstance={playerInstanceFromContext}
        playerState={playerState}
        playVideo={playVideo}
        playerVisibility={playerVisibility}
        saveVolumePref={saveVolumePref}
        setContentToken={setContentToken}
        setPlayerCurrentTime={setPlayerCurrentTime}
        setTimeoutR21PinCheck={setTimeoutR21PinCheck}
        setTimeoutParentalPinCheck={setTimeoutParentalPinCheck}
        showBingeParentalCheck={showBingeParentalCheck}
        showParentalCheck={showParentalCheck}
      />
    </div>
  );
};

NagraPlayerShell.propTypes = {
  currentEpisodeId: PropTypes.string,
  dispatchPlayerAction: PropTypes.func,
  editorialId: PropTypes.string,
  favouriteBtnControls: PropTypes.object,
  epgPlayerDispatch: PropTypes.func,
  episodeNumberAndTitle: PropTypes.string,
  hasBingeWatch: PropTypes.bool,
  history: PropTypes.object,
  isEpgPage: PropTypes.bool,
  isMovieDetails: PropTypes.bool,
  isPlayerReplayed: PropTypes.bool,
  isR21: PropTypes.bool,
  loadCurrentLinearDetails: PropTypes.func,
  playerState: PropTypes.object,
  playerWatchedPosition: PropTypes.number,
  playVideo: PropTypes.func,
  playerVisibility: PropTypes.bool,
  programSelectedInfo: PropTypes.object,
  recommendations: PropTypes.array,
  setPlayerCurrentTime: PropTypes.func,
  setPlayerReplayed: PropTypes.func,
  setTimeoutR21PinCheck: PropTypes.func,
  setTimeoutParentalPinCheck: PropTypes.func,
  showBingeParentalCheck: PropTypes.shape({
    next: PropTypes.bool,
    prev: PropTypes.bool
  }),
  streamUrl: PropTypes.shape({
    drmID: PropTypes.string,
    uri: PropTypes.string
  }),
  title: PropTypes.string
};

export default NagraPlayerShell;
