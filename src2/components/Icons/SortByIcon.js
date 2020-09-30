import React from 'react';

import PropTypes from 'prop-types';

const SortByIcon = ({ iconContainer, iconStyle }) => (
  <div className={iconContainer}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" />
        <path
          className={iconStyle}
          // eslint-disable-next-line eslint-comments/disable-enable-pair
          /* eslint-disable max-len */
          d="M5.5 5c.513 0 .936.358.993.82l.007.109v10.057l1.14-.826c.402-.292.945-.173 1.213.264.249.406.173.945-.161 1.253l-.082.067L5.5 19l-3.11-2.256c-.402-.292-.511-.883-.243-1.32.249-.406.735-.537 1.125-.32l.088.056 1.14.826V5.929c0-.513.448-.929 1-.929zM13 16.838c.552 0 1 .442 1 .987 0 .507-.386.924-.883.981l-.117.007h-1c-.552 0-1-.442-1-.988 0-.506.386-.923.883-.98l.117-.007h1zm2-3.95c.552 0 1 .442 1 .987 0 .507-.386.924-.883.981l-.117.007h-3c-.552 0-1-.442-1-.988 0-.506.386-.923.883-.98l.117-.007h3zm3-3.95c.552 0 1 .442 1 .987 0 .507-.386.924-.883.981l-.117.007h-6c-.552 0-1-.442-1-.988 0-.506.386-.924.883-.98L12 8.937h6zm3-3.95c.552 0 1 .442 1 .987 0 .507-.386.924-.883.981L21 6.963h-9c-.552 0-1-.443-1-.988 0-.506.386-.924.883-.98L12 4.987h9z"
        />
      </g>
    </svg>
  </div>
);

SortByIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { SortByIcon };
