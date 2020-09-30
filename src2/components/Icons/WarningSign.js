import React from 'react';
import PropTypes from 'prop-types';

const WarningSign = ({ iconContainer, iconStyle }) => (
  <div className={iconContainer}>
    <svg
      className={iconStyle}
      xmlns="http://www.w3.org/2000/svg"
      width="90"
      height="89"
      viewBox="0 0 90 89"
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#FEEC5A"
          d="M53.366 10.728l38.29 76.55c1.483 2.963.282 6.567-2.682 8.05-.833.417-1.752.634-2.684.634H9.71c-3.314 0-6-2.687-6-6 0-.932.217-1.851.634-2.685l38.29-76.549c1.482-2.964 5.087-4.164 8.05-2.682 1.16.58 2.102 1.521 2.682 2.682z"
          transform="translate(-3 -7)"
        />
        <g fill="#12171B" transform="translate(-3 -7) translate(43.102 36.48)">
          <rect width="10.776" height="32.64" rx="4" />
          <rect width="10.776" height="10.88" y="38.08" rx="4" />
        </g>
      </g>
    </svg>
  </div>
);

WarningSign.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { WarningSign };
