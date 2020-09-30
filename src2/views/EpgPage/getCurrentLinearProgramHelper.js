import { useEffect } from 'react';

import { useEpgCurrentAssetDetails } from '#/services/epg';

import { isStreamDurationFinite, noop, numOfKeys } from '#/helpers';

import { showParentalCheckHelper } from '#/views/CommonDetailsPage/usePinHook';

import { changeTextLabel } from '#/containers/Player/vjsComponentsHelper/modifyTextLabelHelper';

import { VJS_CUSTOM_COMPONENTS } from '#/constants';

const { BACK_BUTTON } = VJS_CUSTOM_COMPONENTS;

export const constructLinearQueue = ({
  newLinearQueueItem,
  playerInstance,
  programSelectedInfo
}) => {
  if (!playerInstance) {
    return;
  }

  const { state } = playerInstance || {};
  const { linearQueue = [] } = state || {};
  const { duration, next, showParentalCheck, title } =
    programSelectedInfo || {};
  const { title: nextTitle } = next || {};
  const { duration: nextDuration, showParentalCheck: nextShowParentalCheck } =
    newLinearQueueItem || next || {};

  const totalDuration = programSelectedInfo
    ? (linearQueue || []).reduce((accDuration, queue) => {
        const { duration: queueDuration } = queue || {};

        return accDuration + queueDuration;
      }, 0)
    : linearQueue[linearQueue.length - 1]?.duration;

  let newQueue = programSelectedInfo
    ? (linearQueue || []).concat({
        duration: totalDuration + duration,
        showParentalCheck,
        title
      })
    : linearQueue;

  if (numOfKeys(next) || numOfKeys(newLinearQueueItem)) {
    newQueue = newQueue.concat({
      duration: programSelectedInfo
        ? totalDuration + duration + nextDuration
        : totalDuration + nextDuration,
      showParentalCheck: nextShowParentalCheck,
      title: nextTitle
    });
  }

  return newQueue;
};

export const modifyLinearQueue = ({
  playerInstance,
  resumeLive,
  startTime
}) => {
  if (!playerInstance || isStreamDurationFinite(playerInstance)) {
    return;
  }

  const nonResumeElapsedDuration = (Date.now() - startTime) / 1000;

  const { state } = playerInstance || {};
  const { lastSavedLiveCurrentTime, linearQueue = [], ...restPlayerState } =
    state || {};
  const elapsedDuration = resumeLive
    ? lastSavedLiveCurrentTime
    : nonResumeElapsedDuration;

  const modifiedLinearQueue = (linearQueue || []).map((queue, queueIndex) => {
    const { duration } = queue || {};
    const { duration: prevDuration = 0 } = linearQueue?.[queueIndex - 1] || {};

    if (elapsedDuration < duration && elapsedDuration > prevDuration) {
      return {
        ...queue,
        showParentalCheck: false
      };
    }

    return queue;
  });

  playerInstance.setState?.({
    ...restPlayerState,
    linearQueue: modifiedLinearQueue
  });
};

export const getCurrentLinearProgram = ({
  messages,
  parentalSettingsData,
  playerInstanceFromContext,
  setProgramSelectedInfo
}) => {
  const [
    lazyloadCurrentLinearDetails,
    { data: { details: currentProgramDetails } = {} } = {}
  ] = useEpgCurrentAssetDetails() || [];

  const { nowPlaying } = currentProgramDetails || {};
  const { next } = nowPlaying || {};
  const { duration: nextDuration, rating: nextRating } = next || {};
  const loadCurrentLinearDetails = channelId => {
    lazyloadCurrentLinearDetails({
      variables: {
        id: channelId
      }
    });
  };
  const showParentalCheckForNextProgram = showParentalCheckHelper({
    parentalSettingsData,
    rating: nextRating
  });
  const newLinearQueueItem = {
    duration: nextDuration,
    showParentalCheck: showParentalCheckForNextProgram
  };

  useEffect(() => {
    if (currentProgramDetails) {
      const { duration, title } = currentProgramDetails || {};
      const { state: { linearQueue } = {} } = playerInstanceFromContext || {};
      const { duration: prevDuration = 0 } = linearQueue?.[0] || {};
      setProgramSelectedInfo(currentProgramDetails);

      changeTextLabel({
        linearProgramDuration: duration,
        messages,
        playerInstance: playerInstanceFromContext,
        title
      });

      const { state } = playerInstanceFromContext || {};
      const { elapsedDuration = 0 } = state || {};
      playerInstanceFromContext.setState?.({
        ...state,
        elapsedDuration: prevDuration
          ? elapsedDuration + prevDuration
          : elapsedDuration + duration,
        programSelectedInfo: {
          ...currentProgramDetails,
          next: {
            ...next,
            showParentalCheck: showParentalCheckForNextProgram
          }
        }
      });
      if (nextDuration) {
        constructLinearQueue({
          playerInstance: playerInstanceFromContext,
          newLinearQueueItem
        });
      }
    }
  }, [currentProgramDetails]);

  return loadCurrentLinearDetails;
};

export const linearQueueParentalCheckHelper = ({
  messages,
  playerCurrentTime,
  playerInstance,
  playVideo = noop
}) => {
  if (!playerInstance) {
    return;
  }

  const { state } = playerInstance || {};
  const { linearQueue, programSelectedInfo } = state || {};
  const { endTime, next: nextProgram } = programSelectedInfo || {};
  const { showParentalCheck: showParentalCheckForNextProgram } =
    nextProgram || {};

  if (endTime > 0 && Date.now() > endTime && showParentalCheckForNextProgram) {
    playerInstance.getChild(BACK_BUTTON).trigger('click');
    playerInstance.setState?.({
      ...state,
      lastSavedLiveCurrentTime: playerInstance.currentTime()
    });
    playVideo(true, { showParentalCheck: showParentalCheckForNextProgram });
  }

  // disable using linear queue for parental check as different streams return different time formats
  // linear queue still needed for timeshift
  if (linearQueue && playerInstance.scrubbing()) {
    linearQueue?.forEach((queue, queueIndex) => {
      const { duration, showParentalCheck, title } = queue || {};
      const { duration: prevDuration = 0 } =
        linearQueue?.[queueIndex - 1] || {};

      if (playerCurrentTime < duration && playerCurrentTime > prevDuration) {
        if (showParentalCheck) {
          playerInstance.getChild(BACK_BUTTON).trigger('click');
          playerInstance.setState?.({
            ...state,
            lastSavedLiveCurrentTime: playerInstance.currentTime()
          });
          playVideo(true, { showParentalCheck });
        }

        changeTextLabel({
          linearProgramDuration: duration - prevDuration,
          messages,
          playerInstance,
          title
        });
      }
    });
  }
};
