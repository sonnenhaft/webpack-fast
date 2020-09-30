import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { VJS_CUSTOM_COMPONENTS } from '#/constants';

export const registerReactComponent = ({ videojs = {} }) => {
  const Component = videojs.getComponent('Component');
  const ReactVjsComponent = videojs.extend(Component, {
    constructor(...args) {
      Component.apply(this, args);
      const [, reactComponentArgs] = args;
      const { iconSrc, rail } = reactComponentArgs;
      iconSrc && this.mountIcon(reactComponentArgs);
      rail && this.mountRail(rail);

      this.on('dispose', () => ReactDOM.unmountComponentAtNode(this.el()));
    },

    mountIcon({ iconSrc, secondaryIconSrc }) {
      ReactDOM.render(
        <Fragment>
          {iconSrc}
          {secondaryIconSrc}
        </Fragment>,
        this.el()
      );
    },

    mountRail(rail) {
      ReactDOM.render(<Fragment>{rail}</Fragment>, this.el());
    }
  });

  videojs.registerComponent(
    VJS_CUSTOM_COMPONENTS.REACT_VJS_COMPONENT,
    ReactVjsComponent
  );
};
