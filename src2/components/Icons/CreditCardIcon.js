import React from 'react';
import PropTypes from 'prop-types';

const CreditCardIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill="#EEE"
        // eslint-disable-next-line max-len
        d="M4.89 5h22.22C29.251 5 31 7.024 31 9.502v12.996C31 24.978 29.252 27 27.11 27H4.89C2.749 27 1 24.976 1 22.498V9.502C1 7.022 2.748 5 4.89 5zm16.97 11.53h3.526c.704 0 1.28.666 1.28 1.483v1.86c0 .816-.575 1.483-1.28 1.483H21.86c-.704 0-1.28-.667-1.28-1.482v-1.861c0-.816.574-1.483 1.28-1.483zM5.55 16.19h7.408v2.258H5.55V16.19zm0 3.799h11.294v2.258H5.549v-2.258zm-2.5-9.063H28.95V9.5c0-1.169-.83-2.13-1.84-2.13H4.89c-1.01 0-1.84.961-1.84 2.13v1.425zm25.901 3.137H3.05v8.435c0 1.169.83 2.13 1.84 2.13h22.22c1.01 0 1.84-.961 1.84-2.13v-8.435z"
      />
      <path d="M0 0H32V32H0z" />
    </g>
  </svg>
);

CreditCardIcon.propTypes = {
  className: PropTypes.string
};

export { CreditCardIcon };
