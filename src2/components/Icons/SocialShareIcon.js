import React from 'react';
import PropTypes from 'prop-types';

const SocialShareIcon = ({ iconContainer = '' }) => (
  <div className={iconContainer}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#EEE"
          // eslint-disable-next-line max-len
          d="M18.257 15.704c-.604 0-1.152.212-1.645.53l-7.184-3.97c0-.107.055-.212.055-.266 0-.052 0-.21-.055-.265l7.184-3.968c.439.317 1.041.529 1.645.529 1.535 0 2.742-1.164 2.742-2.647C20.999 4.165 19.793 3 18.257 3c-1.535 0-2.742 1.164-2.742 2.647 0 .106 0 .159.054.265l-7.182 3.97c-.439-.317-.987-.528-1.645-.528C5.207 9.354 4 10.518 4 12c0 1.481 1.206 2.646 2.742 2.646.604 0 1.151-.211 1.645-.529l7.183 3.97c0 .106-.054.159-.054.265 0 1.482 1.206 2.647 2.742 2.647C19.793 21 21 19.836 21 18.353c-.001-1.484-1.208-2.649-2.743-2.649z"
        />
        <path d="M0 0H24V24H0z" />
      </g>
    </svg>
  </div>
);

SocialShareIcon.propTypes = {
  iconContainer: PropTypes.string
};

export { SocialShareIcon };
