import React from 'react';
import PropTypes from 'prop-types';

const GoToLiveIcon = ({ iconContainer, iconStyle }) => (
  <div className={iconContainer}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H32V32H0z" />
        <path
          className={iconStyle}
          // eslint-disable-next-line max-len
          d="M25 26v1c0 .552-.448 1-1 1H8c-.552 0-1-.448-1-1v-1h18zm4.27-18c.41 0 .702.258.728.635l.002.054v14.622c0 .387-.274.663-.672.687L29.27 24H2.73c-.41 0-.702-.258-.728-.635L2 23.311V8.689c0-.387.274-.663.672-.687L2.73 8h26.54zM7.976 12.658H6.134l-1.458 7.018h4.656l.298-1.398H6.802l1.174-5.62zm5.9 0h-1.77l-1.414 7.018h1.77l1.415-7.018zm2.47 0h-1.761l.878 7.018h2.14l3.705-7.018H19.43l-2.019 4.055c-.14.28-.261.546-.361.8-.067.169-.126.333-.176.492l-.069.234h-.047c.01-.119.017-.239.022-.36.004-.123.007-.244.007-.366 0-.171-.005-.346-.015-.524l-.017-.268-.025-.27-.385-3.793zm10.624 0h-4.346l-1.316 7.018h4.446l.248-1.314h-2.8l.32-1.728h2.55l.234-1.265H23.76l.256-1.407h2.705l.248-1.304zM24 4c.552 0 1 .448 1 1v1H7V5c0-.552.448-1 1-1z"
        />
      </g>
    </svg>
  </div>
);

GoToLiveIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { GoToLiveIcon };
