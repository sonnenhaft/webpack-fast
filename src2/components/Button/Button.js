import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Spinner from '#/components/Spinner/Spinner';

import { noop } from '#/helpers';

import {
  button,
  container,
  iconStyle,
  iconContainer,
  leftIconContainer,
  darkButton,
  lightButton,
  whiteButton,
  textButton,
  buttonSpinnerContainer,
  buttonSpinner
} from './button.scss';

const TextButton = ({
  disabled = false,
  text = '',
  onClick = noop,
  className = ''
}) => (
  <button
    disabled={disabled}
    className={classNames(textButton, className)}
    onClick={onClick}
  >
    <span>{text}</span>
  </button>
);

const Button = ({
  dark,
  light,
  white,
  children,
  className,
  disabled,
  displayText,
  customIconStyle,
  hasLeftIcon,
  Icon,
  onClick,
  loading
}) => {
  const iconStyles = {
    iconStyle,
    iconContainer: hasLeftIcon ? leftIconContainer : iconContainer,
    ...customIconStyle
  };
  const buttonIcon = Icon && <Icon {...iconStyles} />;

  return (
    <div
      className={classNames(container, {
        [darkButton]: dark && !light,
        [lightButton]: light,
        [whiteButton]: white,
        [className]: Boolean(className)
      })}
    >
      {loading ? (
        <div className={buttonSpinnerContainer}>
          <Spinner className={buttonSpinner} />
        </div>
      ) : (
        <button onClick={onClick} className={button} disabled={disabled}>
          {hasLeftIcon && buttonIcon}
          {displayText && <span>{displayText}</span>}
          {children}
          {!hasLeftIcon && buttonIcon}
        </button>
      )}
    </div>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  customIconStyle: PropTypes.object,
  dark: PropTypes.bool,
  disabled: PropTypes.bool,
  displayText: PropTypes.string,
  hasLeftIcon: PropTypes.bool,
  Icon: PropTypes.func,
  light: PropTypes.bool,
  loading: PropTypes.bool,
  white: PropTypes.bool,
  onClick: PropTypes.func
};

Button.defaultProps = {
  dark: false,
  light: false,
  disabled: false,
  loading: false
};

TextButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  onClick: PropTypes.func
};

export { Button as default, TextButton };
