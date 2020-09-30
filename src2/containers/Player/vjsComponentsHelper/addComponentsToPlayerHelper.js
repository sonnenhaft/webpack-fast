import isEqual from 'react-fast-compare';

import { registerReactComponent } from './addReactComponentHelper';
import { registerControlBar } from './addControlsHelper';
import { registerBackButtonComponent } from './addBackButtonHelper';
import {
  addAudioSubtitleSelection,
  registerAudioSubtitleSelectionOverlay,
  setAudioTrackOnReplay,
  setSubtitleTrackOnReplay
} from './addAudioSubtitleSelectionOverlay';
import {
  addRecommendationRailsOverlay,
  registerRecommendationRailsOverlay
} from './addRecommendationRailsHelper';
import { registerBackgroundOverlay } from './addBackgroundOverlayHelper';
import { registerErrorPrompt } from './addErrorPrompt';
import { getPlayerControlsList } from './customPlayerControlsList';
import { getPlayerBackButton } from './customPlayerBackButton';
import { changeTextLabel } from './modifyTextLabelHelper';

import { getStorageValue, isStreamDurationFinite, noop } from '#/helpers';

import {
  USER_PREFERENCE,
  VJS_CUSTOM_CLASSNAMES,
  VJS_CUSTOM_COMPONENTS
} from '#/constants';

const {
  AUDIO_SUBTITLE_SELECTION_OVERLAY,
  BACK_BUTTON,
  BACKGROUND_OVERLAY,
  CONTROL_BAR,
  CONTROL_BAR_CLICKABLE_COMPONENT,
  CURRENT_TIME_DISPLAY,
  DURATION_DISPLAY,
  REACT_VJS_COMPONENT,
  SEEK_BAR,
  TEXT_LABEL,
  VOLUME_CONTROL
} = VJS_CUSTOM_COMPONENTS;

const {
  disabledButtonClass,
  hiddenClass,
  secondaryActiveIcon,
  visibleIcon,
  volume
} = VJS_CUSTOM_CLASSNAMES;

export const addBackButtonToPlayer = ({
  playerInstance = {},
  videojs = {}
}) => {
  if (playerInstance.getChild(BACK_BUTTON)) {
    return;
  }

  registerReactComponent({ videojs });
  registerBackButtonComponent({ playerInstance, videojs });

  const playerBackButton = getPlayerBackButton();
  const backButton = playerInstance.addChild(BACK_BUTTON, {
    ...playerBackButton
  });
  backButton.addChild(REACT_VJS_COMPONENT, { ...playerBackButton });
};

export const addErrorPrompt = (videojs = {}) => registerErrorPrompt(videojs);

export const addVolumeControlListener = ({
  controlBarButton,
  playerInstance,
  volumeControl,
  volumePref
}) => {
  controlBarButton.on('mouseover', () => volumeControl.addClass(visibleIcon));
  controlBarButton.on('mouseout', () => volumeControl.removeClass(visibleIcon));
  playerInstance.on('volumechange', () => {
    if (playerInstance.volume() === 0) {
      controlBarButton.addClass(secondaryActiveIcon);

      return;
    }
    controlBarButton.removeClass(secondaryActiveIcon);
  });
  playerInstance.volume(volumePref);
};

export const disableControlBarButton = ({
  currentEpisodeIndex,
  maxEpisodeIndex,
  playerInstance = {}
}) => {
  const controlBarChildren = playerInstance.getChild(CONTROL_BAR)?.children();
  const prevEpisodeButton = controlBarChildren?.[2];
  const nextEpisodeButton = controlBarChildren?.[4];

  if (!maxEpisodeIndex && !currentEpisodeIndex) {
    prevEpisodeButton?.addClass(disabledButtonClass);
    nextEpisodeButton?.addClass(disabledButtonClass);
  } else if (currentEpisodeIndex === 0) {
    prevEpisodeButton?.addClass(disabledButtonClass);
  } else if (currentEpisodeIndex === maxEpisodeIndex) {
    nextEpisodeButton?.addClass(disabledButtonClass);
  } else {
    prevEpisodeButton?.removeClass(disabledButtonClass);
    nextEpisodeButton?.removeClass(disabledButtonClass);
  }
};

export const addComponentsToPlayer = async ({
  currentEpisodeIndex,
  dispatchPlayerAction,
  episodeNumberAndTitle,
  isR21,
  languageMap = {},
  maxEpisodeIndex,
  maximumTimeShiftHours,
  messages = {},
  playerInstance = {},
  playVideo = noop,
  title = '',
  videojs = {}
}) => {
  const { mins } = messages;
  const { volume: volumePref } = (await getStorageValue(USER_PREFERENCE)) || {};
  const { state } = playerInstance || {};
  const {
    programSelectedInfo: {
      duration: currentLinearDuration,
      isCatchUpSupported,
      startOverSupport,
      title: currentLinearTitle
    } = {}
  } = state || {};
  const playerDuration = currentLinearDuration || playerInstance.duration();
  const isVod = Number.isFinite(playerInstance.duration());
  const displayedTitle = title || currentLinearTitle || '';

  // adding controls
  if (!playerInstance.getChild(CONTROL_BAR)) {
    registerReactComponent({ videojs });
    registerControlBar({
      dispatchPlayerAction,
      isR21,
      isVod,
      maximumTimeShiftHours,
      messages,
      playerInstance,
      playVideo,
      videojs
    });
    registerAudioSubtitleSelectionOverlay({
      messages,
      playerInstance,
      videojs
    });
    registerRecommendationRailsOverlay({ videojs });
    registerBackgroundOverlay({ videojs, playerInstance });

    playerInstance.addChild(BACKGROUND_OVERLAY);

    const controlBar = playerInstance.addChild(CONTROL_BAR);
    getPlayerControlsList({
      isVod,
      messages,
      playerInstance
    }).forEach(control => {
      const controlBarButton = controlBar.addChild(
        CONTROL_BAR_CLICKABLE_COMPONENT,
        {
          ...control
        }
      );
      controlBarButton.addChild(REACT_VJS_COMPONENT, { ...control });

      const { className } = control;

      if (className === volume) {
        const volumeControl = controlBarButton.addChild(VOLUME_CONTROL);
        addVolumeControlListener({
          controlBarButton,
          playerInstance,
          volumeControl,
          volumePref
        });
      }
    });

    const seekBar = playerInstance.addChild(SEEK_BAR);
    const timeDisplay = seekBar.addChild(CURRENT_TIME_DISPLAY);
    seekBar.addChild(DURATION_DISPLAY);
    if (!isVod && !startOverSupport) {
      seekBar.addClass(hiddenClass);
      timeDisplay.addClass(hiddenClass);
    }

    // adding captions and multi audio selection overlay
    addAudioSubtitleSelection({ languageMap, messages, playerInstance });

    // adding recommendation rails overlay
    addRecommendationRailsOverlay({ playerInstance });

    // adding labels
    const minsValue = playerDuration / 60;
    playerInstance.addChild(TEXT_LABEL, {
      episodeNumberAndTitle,
      title: displayedTitle,
      duration: Number.isNaN(minsValue)
        ? ''
        : `${Math.round(minsValue)} ${mins}`
    });
  } else {
    const liveCurrentTime = playerInstance?.liveTracker?.liveCurrentTime();
    const playerCurrentTime = playerInstance?.currentTime();
    const isTimeshifting =
      !isStreamDurationFinite(playerInstance) &&
      playerCurrentTime / liveCurrentTime < 0.99;
    if (isStreamDurationFinite(playerInstance) || !isTimeshifting) {
      changeTextLabel({
        ...(episodeNumberAndTitle && { episodeNumberAndTitle }),
        linearProgramDuration: currentLinearDuration,
        messages,
        playerInstance,
        title: displayedTitle
      });
    }

    const controlBar = playerInstance.getChild(CONTROL_BAR);
    const controlBarChildren = controlBar?.children();
    const controlBarButton = controlBarChildren.find(
      child => child.options()?.className === volume
    );
    const volumeButtonChildren = controlBarButton?.children();
    const volumeControl = volumeButtonChildren[volumeButtonChildren.length - 1];

    addVolumeControlListener({
      controlBarButton,
      playerInstance,
      volumeControl,
      volumePref
    });

    // set audio and subtitle track
    const [audioSelection, subtitleSelection] = playerInstance
      .getChild(AUDIO_SUBTITLE_SELECTION_OVERLAY)
      .children();
    const audioSelectionOnReplay = setAudioTrackOnReplay({
      audioSelection,
      playerInstance
    });
    const audioTracks = audioSelection
      .getAvailableTracks()
      ?.map(({ audio }) => audio);
    const audioTracksOnReplay = audioSelectionOnReplay?.map(
      ({ audio }) => audio
    );

    const subtitleSelectionOnReplay = setSubtitleTrackOnReplay({
      playerInstance,
      subtitleSelection
    });
    const subtitleTracks = subtitleSelection
      .getAvailableTracks()
      ?.map(({ text }) => text);
    const subtitleTracksOnReplay = subtitleSelectionOnReplay?.map(
      ({ text }) => text
    );

    if (
      !isEqual(audioTracks, audioTracksOnReplay) ||
      !isEqual(subtitleTracks, subtitleTracksOnReplay)
    ) {
      playerInstance.removeChild(AUDIO_SUBTITLE_SELECTION_OVERLAY);
      addAudioSubtitleSelection({ languageMap, messages, playerInstance });
    }
  }

  if (isVod && !isCatchUpSupported) {
    disableControlBarButton({
      currentEpisodeIndex,
      maxEpisodeIndex,
      playerInstance
    });
  }
};

export const removeComponentsToPlayer = (playerInstance = {}) => {
  const controlBar = playerInstance.getChild(CONTROL_BAR);
  const controlBarButton = controlBar?.getChild(
    CONTROL_BAR_CLICKABLE_COMPONENT
  );

  if (controlBarButton) {
    controlBarButton.off('mouseover');
    controlBarButton.off('mouseover');
  }

  controlBar?.off('volumechange');
  playerInstance.removeChild(CONTROL_BAR);
};

export const removeBackButtonToPlayer = (playerInstance = {}) => {
  playerInstance.removeChild(BACK_BUTTON);
};
