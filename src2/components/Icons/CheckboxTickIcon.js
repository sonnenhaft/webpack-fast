import React from 'react';
import PropTypes from 'prop-types';

const CheckboxTick = ({ iconContainer = '', iconStyle = '' }) => (
  <svg
    className={iconContainer}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g fill="none" fillRule="evenodd">
      <path
        className={iconStyle}
        fill="#73C20E"
        d="M18.383 7.168c.525.59.47 1.542-.06 2.132l-6.683 7.418c-.542.631-.875 1-1 1.105-.393.332-.975.197-1.745-.407l-3.221-3.42c-.537-.595-.58-1.566-.039-2.175.568-.582 1.41-.57 1.946.026l2.549 2.417 6.346-7.045c.532-.59 1.383-.641 1.907-.051z"
      />
    </g>
  </svg>
);

CheckboxTick.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { CheckboxTick };
