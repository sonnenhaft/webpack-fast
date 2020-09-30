import React from 'react';
import PropTypes from 'prop-types';

const EpisodesIcon = ({ iconStyle = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <g fill="none" fillRule="evenodd">
      <path d="M0 0H32V32H0z" transform="rotate(-180 16 16)" />
      <path
        className={iconStyle}
        // eslint-disable-next-line max-len
        d="M21.851 28c.64 0 1.15.452 1.15 1 0 .549-.512 1-1.15 1h-11.7c-.639 0-1.15-.452-1.15-1 0-.549.512-1 1.15-1zm2.058-4c.607 0 1.092.452 1.092 1 0 .549-.486 1-1.092 1H7.094C6.487 26 6 25.548 6 25c0-.549.487-1 1.093-1zm4.983-22c.578 0 1.047.454 1.104 1.027l.005.116v17.714c0 .588-.434 1.078-.995 1.137l-.114.006H3.11c-.578 0-1.048-.454-1.104-1.027L2 20.857V3.143c0-.588.435-1.078.996-1.137L3.11 2h25.78zm-1.11 2.289H4.223v15.425h23.56V4.29z"
        transform="rotate(-180 16 16)"
      />
      <g>
        <path
          d="M0 0H11.294V11.294H0z"
          transform="rotate(-180 16 16) rotate(-180 10.647 9)"
        />
        <path
          className={iconStyle}
          d="M10.043 4.86L3.283.75c-.564-.336-1.289.083-1.289.754v8.137c0 .671.724 1.09 1.288.755l6.76-4.11c.564-.252.564-1.091 0-1.427v.001z"
          transform="rotate(-180 16 16) rotate(-180 10.647 9)"
        />
      </g>
    </g>
  </svg>
);

EpisodesIcon.propTypes = {
  iconStyle: PropTypes.string
};

export { EpisodesIcon };
