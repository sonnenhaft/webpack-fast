import React from 'react';
import PropTypes from 'prop-types';

const SuccessIcon = ({ iconContainer, iconStyle }) => (
  <svg
    className={iconContainer}
    xmlns="http://www.w3.org/2000/svg"
    width="96"
    height="96"
    viewBox="0 0 96 96"
  >
    <g fill="none" fillRule="evenodd">
      <path
        className={iconStyle}
        fill="#9CCB5F"
        d="M48 96C21.532 96 0 74.467 0 48S21.532 0 48 0s48 21.533 48 48-21.532 48-48 48z"
      />
      <path
        fill="#FFF"
        d="M36.994 68.16L20.06 51.035c-1.54-1.558-1.541-4.066 0-5.625l.267-.27c1.553-1.57 4.085-1.585 5.656-.032l.032.032 13.822 13.977 30.488-30.83c1.553-1.57 4.086-1.585 5.657-.031l.032.031.266.27c1.541 1.558 1.541 4.067 0 5.625L42.682 68.159c-1.553 1.571-4.086 1.585-5.657.032l-.031-.032z"
      />
    </g>
  </svg>
);

SuccessIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { SuccessIcon };
