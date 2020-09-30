import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { CrossIcon } from '#/components/Icons';

import {
  crossIconContainer,
  overlayOuterContainer,
  overlayInnerContainer,
  visible
} from './overlayComponent.scss';

const OverlayComponent = ({
  children,
  innerClassName,
  customDimension,
  isOverlayOpen,
  toggleOverlayState
}) => {
  const overlayOuterClass = classNames(overlayOuterContainer, {
    [visible]: isOverlayOpen
  });
  const overlayInnerClass = classNames(overlayInnerContainer, customDimension, {
    [innerClassName]: Boolean(innerClassName)
  });

  // TODO: Introduce <dialog>

  return (
    <div className={overlayOuterClass}>
      <div className={overlayInnerClass}>
        <CrossIcon
          iconContainer={crossIconContainer}
          onClick={toggleOverlayState}
        />
        {children}
      </div>
    </div>
  );
};

OverlayComponent.propTypes = {
  children: PropTypes.node,
  innerClassName: PropTypes.string,
  customDimension: PropTypes.string,
  isOverlayOpen: PropTypes.bool,
  toggleOverlayState: PropTypes.func
};

export default OverlayComponent;
