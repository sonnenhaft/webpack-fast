import { VJS_CUSTOM_CLASSNAMES, VJS_CUSTOM_COMPONENTS } from '#/constants';
import { hideAudioSubtitleSelection } from './addAudioSubtitleSelectionOverlay';

const { BACKGROUND_OVERLAY } = VJS_CUSTOM_COMPONENTS;
const { backgroundOverlay } = VJS_CUSTOM_CLASSNAMES;

export const registerBackgroundOverlay = ({
  playerInstance = {},
  videojs = {}
}) => {
  const ClickableComponent = videojs.getComponent('ClickableComponent');
  const BackgroundOverlay = videojs.extend(ClickableComponent, {
    constructor(...args) {
      ClickableComponent.apply(this, args);
    },

    createEl() {
      return videojs.dom.createEl('div', {
        className: backgroundOverlay
      });
    },

    handleClick() {
      hideAudioSubtitleSelection(playerInstance);
    }
  });

  videojs.registerComponent(BACKGROUND_OVERLAY, BackgroundOverlay);
};
