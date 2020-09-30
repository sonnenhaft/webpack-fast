import {
  USER_PREFERENCE,
  VJS_CUSTOM_CLASSNAMES,
  VJS_CUSTOM_COMPONENTS
} from '#/constants';
import { getStorageValue } from '#/helpers';

import successIcon from '#/static/images/ico_success.svg';

const {
  AUDIO_OR_SUBTITLE_SELECTION,
  AUDIO_SUBTITLE_SELECTION_OVERLAY,
  CLICKABLE_OPTION
} = VJS_CUSTOM_COMPONENTS;

const {
  audioOrSubtitleSelectionOverlay,
  audioOrSubtitleSelectionSection
} = VJS_CUSTOM_CLASSNAMES;

export const toggleAudioSubtitleSelection = ({ playerInstance = {} }) =>
  playerInstance?.getChild(AUDIO_SUBTITLE_SELECTION_OVERLAY).setToggleState();

export const hideAudioSubtitleSelection = (playerInstance = {}) =>
  playerInstance
    ?.getChild(AUDIO_SUBTITLE_SELECTION_OVERLAY)
    ?.hideSelectionOverlay();

const registerClickableComponent = ({
  messages = {},
  playerInstance = {},
  videojs = {}
}) => {
  const { trackSelectionHeaderAudio, trackSelectionHeaderSubtitle } = messages;
  const ClickableComponent = videojs.getComponent('ClickableComponent');
  const CustomClickableComponent = videojs.extend(ClickableComponent, {
    constructor(...args) {
      ClickableComponent.apply(this, args);
      this.addIcon();
    },

    createEl() {
      const { enabled, language } = this.options_;

      return videojs.dom.createEl('span', {
        innerText: language,
        className: `${enabled ? 'active' : ''}`
      });
    },

    addIcon() {
      const selectedIcon = videojs.dom.createEl('img', {
        src: successIcon
      });
      videojs.dom.appendContent(this.el(), selectedIcon);
    },

    handleClick() {
      const { languageIndex, type } = this.options_;
      const audioOrSubtitleSelection = playerInstance
        .getChild(AUDIO_SUBTITLE_SELECTION_OVERLAY)
        .children()
        .find(selectionType => selectionType.options_.type === type);
      const originalSelectedTrackIndex = audioOrSubtitleSelection.getSelectedTrack();
      audioOrSubtitleSelection.clearSelectedTrack();
      audioOrSubtitleSelection.setTrack(languageIndex);
      this.addClass('active');

      if (type === trackSelectionHeaderAudio) {
        playerInstance.audioTracks()[languageIndex].enabled = true;
      } else if (type === trackSelectionHeaderSubtitle) {
        const textTracks = playerInstance.textTracks();
        if (languageIndex) {
          if (originalSelectedTrackIndex) {
            textTracks[originalSelectedTrackIndex - 1].mode = 'disabled';
          }
          textTracks[languageIndex - 1].mode = 'showing';
        } else {
          for (
            let trackIndex = 0;
            trackIndex < textTracks.length;
            trackIndex += 1
          ) {
            textTracks[trackIndex].mode = 'disabled';
          }
        }
      }
    }
  });

  videojs.registerComponent(CLICKABLE_OPTION, CustomClickableComponent);
};

const registerAudioOrSubtitleComponent = ({ videojs = {} }) => {
  const Component = videojs.getComponent('Component');
  const SubtitleComponent = videojs.extend(Component, {
    constructor(...args) {
      Component.apply(this, args);
    },

    createEl() {
      const { type } = this.options_;

      return videojs.dom.createEl('div', {
        className: audioOrSubtitleSelectionSection,
        innerText: type
      });
    },

    setTrack(languageIndex) {
      this.trackSelected = languageIndex;
    },

    clearSelectedTrack() {
      this.children()[this.trackSelected]?.removeClass('active');
    },

    getSelectedTrack() {
      return this.trackSelected;
    },

    setAvailableTracks(tracks) {
      this.availableTracks = tracks;
    },

    getAvailableTracks() {
      return this.availableTracks;
    }
  });

  videojs.registerComponent(AUDIO_OR_SUBTITLE_SELECTION, SubtitleComponent);
};

export const registerAudioSubtitleSelectionOverlay = ({
  messages = {},
  playerInstance = {},
  videojs = {}
}) => {
  const Component = videojs.getComponent('Component');
  const OverlayComponent = videojs.extend(Component, {
    constructor(...args) {
      Component.apply(this, args);
      registerAudioOrSubtitleComponent({ videojs });
      registerClickableComponent({ videojs, playerInstance, messages });
    },

    createEl() {
      this.toggleState = false;

      return videojs.dom.createEl('div', {
        className: `${audioOrSubtitleSelectionOverlay} ${
          this.toggleState ? '' : 'inactive'
        }`
      });
    },

    setToggleState() {
      if (this.toggleState) {
        this.hideSelectionOverlay();

        return;
      }

      videojs.dom.removeClass(this.el(), 'inactive');
      this.toggleState = true;
    },

    hideSelectionOverlay() {
      videojs.dom.addClass(this.el(), 'inactive');
      this.toggleState = false;
    }
  });

  videojs.registerComponent(AUDIO_SUBTITLE_SELECTION_OVERLAY, OverlayComponent);
};

const setAudioTrack = async ({
  audioSelection = {},
  languageMap = {},
  playerInstance = {}
}) => {
  const { audio: { name: audioPrefName = '' } = {} } =
    (await getStorageValue(USER_PREFERENCE)) || {};

  const sortedAudioTracks = playerInstance
    .audioTracks()
    ?.tracks_?.sort(({ id: firstId }, { id: secondId }) => firstId - secondId);

  sortedAudioTracks?.forEach(({ label }, index) => {
    if (
      (languageMap[label] === audioPrefName || label === audioPrefName) &&
      sortedAudioTracks[index]
    ) {
      sortedAudioTracks[index].enabled = true;
      audioSelection.setTrack(index);
    }
  });

  return sortedAudioTracks?.map(({ enabled, language, label }, index) => {
    if (enabled) {
      audioSelection.setTrack(index);
    }

    return {
      language,
      audio: label,
      enabled
    };
  });
};

export const setAudioTrackOnReplay = ({ audioSelection, playerInstance }) => {
  const selectedAudioTrackIndex = audioSelection.getSelectedTrack();
  const sortedAudioTracks = playerInstance
    .audioTracks()
    ?.tracks_?.sort(({ id: firstId }, { id: secondId }) => firstId - secondId);

  const selectedAudioTrack = sortedAudioTracks[selectedAudioTrackIndex];
  if (selectedAudioTrack) {
    selectedAudioTrack.enabled = true;
  }

  return sortedAudioTracks?.map(({ enabled, language, label }) => ({
    audio: label,
    language,
    enabled
  }));
};

const setSubtitleTrack = async ({
  languageMap = {},
  playerInstance = {},
  subtitleSelection = {}
}) => {
  const { subtitles: { name: subtitlesPrefName = '' } = {} } =
    (await getStorageValue(USER_PREFERENCE)) || {};

  playerInstance.textTracks()?.tracks_?.forEach(({ label }, trackIndex) => {
    if (
      (languageMap[label] === subtitlesPrefName ||
        label === subtitlesPrefName) &&
      playerInstance.textTracks()?.tracks_[trackIndex]
    ) {
      playerInstance.textTracks().tracks_[trackIndex].mode = 'showing';
      subtitleSelection.setTrack(trackIndex + 1);

      return;
    }

    playerInstance.textTracks().tracks_[trackIndex].mode = 'disabled';
  });
  if (!subtitleSelection.getSelectedTrack()) {
    subtitleSelection.setTrack(0);
  }

  return playerInstance
    .textTracks()
    ?.tracks_?.map(({ label, language, mode }, trackIndex) => {
      mode === 'showing' && subtitleSelection.setTrack(trackIndex + 1);

      return {
        language,
        text: label,
        enabled: mode === 'showing'
      };
    });
};

export const setSubtitleTrackOnReplay = ({
  playerInstance,
  subtitleSelection
}) => {
  const selectedSubtitleTrackIndex = subtitleSelection.getSelectedTrack() - 1;

  return playerInstance
    .textTracks()
    ?.tracks_?.map(({ label, language, mode }, index) => {
      const subtitleTrack = playerInstance.textTracks()?.tracks_[index];
      if (subtitleTrack) {
        if (selectedSubtitleTrackIndex === index) {
          subtitleTrack.mode = 'showing';

          return {
            language,
            text: label,
            enabled: mode === 'showing'
          };
        }

        subtitleTrack.mode = 'disabled';

        return {
          language,
          text: label,
          enabled: mode === 'showing'
        };
      }
    });
};

export const addAudioSubtitleSelection = async ({
  languageMap = {},
  messages = {},
  playerInstance = {}
}) => {
  const {
    defaultSubtitleTrack,
    trackSelectionHeaderAudio,
    trackSelectionHeaderSubtitle
  } = messages;

  const audioSubtitleSelectionOverlay = playerInstance.addChild(
    AUDIO_SUBTITLE_SELECTION_OVERLAY
  );
  const audioSelection = audioSubtitleSelectionOverlay.addChild(
    AUDIO_OR_SUBTITLE_SELECTION,
    { type: trackSelectionHeaderAudio }
  );
  const availableAudio = await setAudioTrack({
    audioSelection,
    languageMap,
    playerInstance
  });
  availableAudio.forEach(({ audio, enabled, language }, index) =>
    audioSelection.addChild(CLICKABLE_OPTION, {
      language: languageMap[audio] || languageMap[language] || audio,
      languageIndex: index,
      type: trackSelectionHeaderAudio,
      enabled
    })
  );
  audioSelection.setAvailableTracks(availableAudio);

  const subtitleSelection = audioSubtitleSelectionOverlay.addChild(
    AUDIO_OR_SUBTITLE_SELECTION,
    { type: trackSelectionHeaderSubtitle }
  );
  const availableSubtitle = await setSubtitleTrack({
    languageMap,
    playerInstance,
    subtitleSelection
  });
  const defaultNoSubtitle = [
    {
      text: defaultSubtitleTrack,
      enabled: !subtitleSelection.getSelectedTrack()
    }
  ];
  subtitleSelection.setAvailableTracks(availableSubtitle);

  defaultNoSubtitle
    .concat(availableSubtitle)
    .forEach(({ enabled, language, text }, trackIndex) =>
      subtitleSelection.addChild(CLICKABLE_OPTION, {
        language:
          text === defaultSubtitleTrack
            ? defaultSubtitleTrack
            : languageMap[text] || languageMap[language] || text,
        languageIndex: trackIndex,
        type: trackSelectionHeaderSubtitle,
        enabled
      })
    );
};
