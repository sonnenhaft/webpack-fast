import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';

import styles from './login.scss';

export const LoginButton = ({
  text = '',
  onClick = noop,
  disabled = false,
  className
}) => (
  <button
    className={classnames(styles.loginButton, {
      [className]: Boolean(className)
    })}
    onClick={onClick}
    disabled={disabled}
  >
    <div className={styles.loginButtonText}>{text}</div>
  </button>
);

LoginButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  onClick: PropTypes.func
};

export default LoginButton;
