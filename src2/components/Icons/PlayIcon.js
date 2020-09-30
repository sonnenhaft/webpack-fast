import React from 'react';
import PropTypes from 'prop-types';

const PlayIcon = ({ iconContainer, iconStyle }) => (
  <div className={iconContainer}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 32 32"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H32V32H0z" />
        <path
          className={iconStyle}
          d="M28.454 13.77L9.3 2.125c-1.595-.95-3.649.236-3.649 2.138v23.054c0 1.902 2.052 3.09 3.65 2.138l19.154-11.646c1.595-.712 1.595-3.09 0-4.04v.003z"
        />
      </g>
    </svg>
  </div>
);

PlayIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { PlayIcon };
