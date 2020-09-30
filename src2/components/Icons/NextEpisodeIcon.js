import React from 'react';
import PropTypes from 'prop-types';

const NextEpisodeIcon = ({ iconStyle = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <g fill="none" fillRule="evenodd">
      <path d="M2 2H30V30H2z" />
      <path
        className={iconStyle}
        d="M4 6.191c0-1.685 1.82-2.737 3.233-1.894L24.2 14.617c.187.11.348.243.486.392l-.002-8.162c0-1.438 1.15-2.66 2.656-2.66C28.85 4.257 30 5.409 30 6.847V26.34C30 27.778 28.85 29 27.344 29c-1.436 0-2.656-1.152-2.656-2.66l-.001-8.465c-.137.128-.3.237-.486.32L7.233 28.517C5.817 29.359 4 28.307 4 26.622z"
      />
    </g>
  </svg>
);

NextEpisodeIcon.propTypes = {
  iconStyle: PropTypes.string
};

export { NextEpisodeIcon };
