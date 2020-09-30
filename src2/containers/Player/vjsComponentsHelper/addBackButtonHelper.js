import { VJS_CUSTOM_COMPONENTS } from '#/constants';

const { BACK_BUTTON } = VJS_CUSTOM_COMPONENTS;

export const registerBackButtonComponent = ({
  playerInstance = {},
  videojs = {}
}) => {
  const ClickableComponent = videojs.getComponent('ClickableComponent');
  const CustomClickableComponent = videojs.extend(ClickableComponent, {
    constructor(...args) {
      ClickableComponent.apply(this, args);
      const { className } = args[1];
      this.addClass(className);
    },

    handleClick() {
      const { buttonFunction } = this.options_;

      buttonFunction && buttonFunction(playerInstance);
    },

    createEl() {
      return videojs.dom.createEl('div', {
        className: 'vjs-back-button'
      });
    }
  });

  videojs.registerComponent(BACK_BUTTON, CustomClickableComponent);
};
