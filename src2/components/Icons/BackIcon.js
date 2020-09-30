import React from 'react';
import PropTypes from 'prop-types';

const BackIcon = ({ className = '' }) => (
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
        fill="#FFF"
        d="M23.33 6.279L14.466 16l8.866 9.721c.892.98.892 2.566 0 3.545-.893.979-2.34.979-3.233 0L8 16 20.098 2.734c.893-.979 2.34-.979 3.233 0 .892.979.892 2.566 0 3.545z"
      />
    </g>
  </svg>
);

BackIcon.propTypes = {
  className: PropTypes.string
};

export { BackIcon };
