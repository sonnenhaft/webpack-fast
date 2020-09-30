import {
  PLAYER_READY_STATE,
  VJS_CUSTOM_CLASSNAMES,
  VJS_CUSTOM_COMPONENTS
} from '#/constants';
import { noop } from '#/helpers';
import { ONE_HOUR_IN_SEC } from '#/helpers/timeHelpers';
import { goToLiveButtonControl } from './customPlayerControlsList';

import { linearQueueParentalCheckHelper } from '#/views/EpgPage/getCurrentLinearProgramHelper';

const {
  CONTROL_BAR,
  CONTROL_BAR_CLICKABLE_COMPONENT,
  FULL_SCREEN,
  SEEK_BAR,
  TEXT_LABEL,
  VOLUME_CONTROL
} = VJS_CUSTOM_COMPONENTS;

const {
  customLabel,
  disabledButtonClass,
  durationLabel: durationLabelClass,
  fullscreen,
  playPause,
  secondaryActiveIcon,
  titleLabel: titleLabelClass,
  volume
} = VJS_CUSTOM_CLASSNAMES;

const buttonsToResetOnExit = [playPause, volume];

export const resetPlayPauseButtonState = (playerInstance = {}) => {
  const [playPauseButton, volumeButton] =
    playerInstance
      ?.getChild(CONTROL_BAR)
      ?.children_.filter(({ options_: options }) => {
        const { className } = options || {};

        return buttonsToResetOnExit.includes(className);
      }) || [];

  playPauseButton?.toggleStateFn();
  playPauseButton?.removeClass(secondaryActiveIcon);

  volumeButton?.off('mouseover');
  volumeButton?.off('mouseout');
};

const registerButtonHelper = ({
  dispatchPlayerAction,
  isR21,
  maximumTimeShiftHours,
  playerInstance = {},
  playVideo = noop,
  videojs = {}
}) => {
  const ClickableComponent = videojs.getComponent('ClickableComponent');
  const CustomClickableComponent = videojs.extend(ClickableComponent, {
    constructor(...args) {
      ClickableComponent.apply(this, args);
      const { className, disabled, label } = args[1];
      this.addClass(`${className}-btn`);
      disabled && this.addClass(disabledButtonClass);
      this.disabled = disabled;
      this.addHoverText(label);
    },

    handleClick() {
      const { buttonFunction } = this.options_;
      if (
        buttonFunction &&
        playerInstance.readyState() === PLAYER_READY_STATE &&
        !this.disabled
      ) {
        buttonFunction({
          dispatchPlayerAction,
          isR21,
          maximumTimeShiftHours,
          playerInstance,
          playVideo
        });
        this.toggleClass(secondaryActiveIcon);
        this.toggleStateFn();
      }
    },

    addHoverText(label) {
      this.toggleState = false;
      if (label) {
        const hoverText = videojs.dom.createEl('span', {
          innerHTML: label
        });
        videojs.dom.appendContent(this.el(), hoverText);
      }
    },

    toggleStateFn() {
      const { label, secondaryLabel } = this.options_;
      const buttonChildComponents = this.el().children;
      if (secondaryLabel) {
        buttonChildComponents[buttonChildComponents.length - 1].innerHTML = this
          .toggleState
          ? label
          : secondaryLabel;
      }
      this.toggleState = !this.toggleState;
    },

    disableButton(buttonState) {
      this.disabled = buttonState;
      if (buttonState) {
        this.addClass(disabledButtonClass);

        return;
      }

      this.removeClass(disabledButtonClass);
    }
  });

  videojs.registerComponent(
    CONTROL_BAR_CLICKABLE_COMPONENT,
    CustomClickableComponent
  );
};

const registerVolumeControl = ({ videojs = {} }) => {
  const VolumeControlComponent = videojs.getComponent('VolumeControl');
  const CustomVolumeControl = videojs.extend(VolumeControlComponent, {
    constructor(...args) {
      VolumeControlComponent.apply(this, args);
      this.addClass('vjs-custom-volume-control');
      this.addNotch();
    },

    addNotch() {
      const volumeNotch = videojs.dom.createEl('div', {
        className: 'vjs-volume-control-notch'
      });
      videojs.dom.appendContent(
        this.el().getElementsByClassName('vjs-volume-level')[0],
        volumeNotch
      );
    }
  });

  videojs.registerComponent(VOLUME_CONTROL, CustomVolumeControl);
};

const registerFullscreenToggle = ({ videojs = {} }) => {
  const FullscreenControlComponent = videojs.getComponent('FullscreenToggle');
  const CustomFullscreenControl = videojs.extend(FullscreenControlComponent, {
    constructor(...args) {
      FullscreenControlComponent.apply(this, args);
      this.addClass(fullscreen);
    }
  });

  videojs.registerComponent(FULL_SCREEN, CustomFullscreenControl);
};

const registerSeekBar = ({
  isVod,
  maximumTimeShiftHours,
  messages,
  playVideo,
  videojs = {}
}) => {
  const SeekBarComponent = videojs.getComponent('SeekBar');
  const CustomSeekBar = videojs.extend(SeekBarComponent, {
    constructor(...args) {
      SeekBarComponent.apply(this, args);
      this.addClass('vjs-custom-seekbar');
      this.addPlayProgressCircle();
    },

    handleMouseMove(event) {
      const distance = this.calculateDistance(event);
      const playerInstance = this.player();

      // this is needed to allow proper scrubbing of seek bar for live streams
      // https://github.com/videojs/video.js/blob/0c081a3520b2776756abf5f7ad8a7310ade59995/src/js/live-tracker.js#L186
      if (!isVod) {
        playerInstance?.off('play', playerInstance.liveTracker?.handlePlay);
      }

      const vodDuration = playerInstance?.duration();
      const liveCurrentTime = playerInstance?.liveTracker?.liveCurrentTime();
      const isMaxTimeShiftExceeded =
        liveCurrentTime > maximumTimeShiftHours * ONE_HOUR_IN_SEC;
      const adjustedLiveCurrentTime = isMaxTimeShiftExceeded
        ? maximumTimeShiftHours * ONE_HOUR_IN_SEC
        : liveCurrentTime;
      const adjustedLiveNewTime = isMaxTimeShiftExceeded
        ? liveCurrentTime -
          adjustedLiveCurrentTime +
          distance * adjustedLiveCurrentTime
        : distance * adjustedLiveCurrentTime;
      const newTime = isVod ? distance * vodDuration : adjustedLiveNewTime;

      playerInstance?.currentTime(newTime);
      this.update();

      if (distance < 0.99 && !isVod) {
        goToLiveButtonControl({ disable: false, playerInstance });
      }
    },

    getPercent() {
      const playerInstance = this.player();
      const { state } = playerInstance || {};
      const { programSelectedInfo: { startOverSupport } = {} } = state || {};

      if (isVod) {
        const time = playerInstance?.currentTime();
        const ratio = time / playerInstance?.duration();

        return ratio >= 1 ? 1 : ratio;
      }

      const liveCurrentTime = playerInstance?.liveTracker?.liveCurrentTime();
      const playerCurrentTime = playerInstance?.currentTime();

      linearQueueParentalCheckHelper({
        messages,
        playerCurrentTime,
        playerInstance,
        playVideo
      });

      if (!startOverSupport) {
        return 1;
      }

      const maximumTimeShiftSeconds = maximumTimeShiftHours * ONE_HOUR_IN_SEC;
      const isMaxTimeShiftExceeded = liveCurrentTime > maximumTimeShiftSeconds;

      const adjustedPercent = isMaxTimeShiftExceeded
        ? (playerCurrentTime - liveCurrentTime + maximumTimeShiftSeconds) /
          maximumTimeShiftSeconds
        : playerCurrentTime / liveCurrentTime;

      return adjustedPercent;
    },

    addPlayProgressCircle() {
      const playProgressCircle = videojs.dom.createEl('div', {
        className: 'vjs-play-progress-circle'
      });
      videojs.dom.appendContent(
        this.el().getElementsByClassName('vjs-play-progress')[0],
        playProgressCircle
      );
    }
  });
  videojs.registerComponent(SEEK_BAR, CustomSeekBar);
};

const registerLabels = ({ videojs = {} }) => {
  const LabelComponent = videojs.getComponent('Component');
  const CustomLabelComponent = videojs.extend(LabelComponent, {
    constructor(...args) {
      LabelComponent.apply(this, args);
      this.addSubLabels(args[1]);
    },

    createEl() {
      return videojs.dom.createEl('div', {
        className: customLabel
      });
    },

    addSubLabels({ duration, title, episodeNumberAndTitle }) {
      const titleLabel = videojs.dom.createEl('span', {
        className: titleLabelClass,
        innerHTML: `${title}`
      });
      videojs.dom.appendContent(this.el(), titleLabel);

      const metadataContainer = videojs.dom.createEl('div');

      videojs.dom.appendContent(this.el(), metadataContainer);

      if (episodeNumberAndTitle) {
        const episodeNumberAndTitleLabel = videojs.dom.createEl('span', {
          className: 'vjs-episode-display-title-label',
          innerHTML: `${episodeNumberAndTitle}`
        });
        videojs.dom.appendContent(
          metadataContainer,
          episodeNumberAndTitleLabel
        );
      }

      if (duration) {
        const durationLabel = videojs.dom.createEl('span', {
          className: durationLabelClass,
          innerHTML: duration
        });
        videojs.dom.appendContent(metadataContainer, durationLabel);
      }
    }
  });

  videojs.registerComponent(TEXT_LABEL, CustomLabelComponent);
};

export const registerControlBar = ({
  dispatchPlayerAction,
  isR21,
  isVod,
  maximumTimeShiftHours,
  messages,
  playerInstance = {},
  playVideo = noop,
  showParentalCheck,
  videojs = {}
}) => {
  const Component = videojs.getComponent('Component');
  const CustomControl = videojs.extend(Component, {
    constructor(...args) {
      Component.apply(this, args);
      registerButtonHelper({
        dispatchPlayerAction,
        isR21,
        isVod,
        maximumTimeShiftHours,
        playerInstance,
        playVideo,
        showParentalCheck,
        videojs
      });
      registerSeekBar({
        isVod,
        maximumTimeShiftHours,
        messages,
        playVideo,
        videojs
      });
      registerVolumeControl({ videojs });
      registerFullscreenToggle({ videojs });
      registerLabels({ videojs });
    },

    createEl() {
      return videojs.dom.createEl('div', {
        className: 'vjs-custom-control-bar'
      });
    }
  });

  videojs.registerComponent(CONTROL_BAR, CustomControl);
};
