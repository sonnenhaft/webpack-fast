import React from 'react';
import PropTypes from 'prop-types';

const PauseIcon = ({ className = '', iconStyle = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <g fill="none" fillRule="evenodd">
      <path d="M0 0H32V32H0z" />
      <path
        className={iconStyle}
        d="M8 2c1.704-.003 3 1.38 3 3.002v21.996C11 28.62 9.701 30 8 30c-1.704 0-3-1.3-3-3.002V5.002C5 3.38 6.299 2 8 2zm14.998 0C24.702 2.08 26 3.379 26 5.002v21.996C26 28.62 24.702 30 23.002 30c-1.622 0-2.999-1.3-2.999-3.002L20 5.002C20 3.38 21.298 2 22.998 2z"
      />
    </g>
  </svg>
);

PauseIcon.propTypes = {
  className: PropTypes.string,
  iconStyle: PropTypes.string
};

export { PauseIcon };
