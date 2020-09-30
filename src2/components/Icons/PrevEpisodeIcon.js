import React from 'react';
import PropTypes from 'prop-types';

const PrevEpisodeIcon = ({ iconStyle = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <g fill="none" fillRule="evenodd">
      <path d="M2 2H30V30H2z" transform="rotate(-180 16 16)" />
      <path
        className={iconStyle}
        d="M28.25 26.086c0 1.664-1.797 2.703-3.193 1.871l-16.76-10.19c-.184-.108-.344-.24-.48-.386l.002 8.058c0 1.42-1.136 2.627-2.623 2.627-1.491-.07-2.627-1.207-2.627-2.627V6.193c0-1.42 1.136-2.627 2.624-2.627 1.418 0 2.623 1.137 2.623 2.627l.001 8.357c.136-.126.296-.234.48-.316l16.76-10.191c1.398-.832 3.193.207 3.193 1.87z"
      />
    </g>
  </svg>
);

PrevEpisodeIcon.propTypes = {
  iconStyle: PropTypes.string
};

export { PrevEpisodeIcon };
