import React from 'react';
import PropTypes from 'prop-types';

const VolumeMuteIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 24"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill="#EEE"
        d="M17.338 25.981c0 1.665-2.039 2.614-3.441 1.604l-8.095-5.763H1.85C.83 21.822.002 21.05.002 20.1L0 11.9c0-.952.83-1.722 1.848-1.722h3.951l8.096-5.763c1.401-1.01 3.44-.06 3.44 1.604l.003 19.962z"
        transform="translate(0 -4)"
      />
      <path d="M0 0H32V32H0z" transform="translate(0 -4)" />
    </g>
  </svg>
);

VolumeMuteIcon.propTypes = {
  className: PropTypes.string
};

export { VolumeMuteIcon };
