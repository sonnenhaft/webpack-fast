import { VJS_CUSTOM_CLASSNAMES, VJS_CUSTOM_COMPONENTS } from '#/constants';

const { errorPrompt, errorPromptButton } = VJS_CUSTOM_CLASSNAMES;
const { ERROR_PROMPT, ERROR_PROMPT_BUTTON } = VJS_CUSTOM_COMPONENTS;

const registerButtonHelper = (videojs = {}) => {
  const ClickableComponent = videojs.getComponent('ClickableComponent');
  const ErrorPromptButton = videojs.extend(ClickableComponent, {
    constructor(...args) {
      ClickableComponent.apply(this, args);
    },

    createEl() {
      const { text } = this.options_ || {};

      return videojs.dom.createEl('div', {
        className: errorPromptButton,
        innerText: text
      });
    },

    handleClick() {
      const { buttonFunction } = this.options_ || {};
      buttonFunction();
    }
  });

  videojs.registerComponent(ERROR_PROMPT_BUTTON, ErrorPromptButton);
};

export const registerErrorPrompt = (videojs = {}) => {
  const Component = videojs.getComponent('Component');
  const ErrorPrompt = videojs.extend(Component, {
    constructor(...args) {
      Component.apply(this, args);
      registerButtonHelper(videojs);
      args[1].forEach(({ className, text }) =>
        this.addText({ className, text })
      );
    },

    createEl() {
      return videojs.dom.createEl('div', {
        className: errorPrompt
      });
    },

    addText({ className, text }) {
      const errorTitle = videojs.dom.createEl('div', {
        className,
        innerText: text
      });
      videojs.dom.appendContent(this.el(), errorTitle);
    }
  });

  videojs.registerComponent(ERROR_PROMPT, ErrorPrompt);
};
