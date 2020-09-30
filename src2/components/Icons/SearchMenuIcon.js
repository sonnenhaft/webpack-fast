import React from 'react';
import PropTypes from 'prop-types';

const SearchMenuIcon = ({ className, iconStyle }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <defs>
        <path
          id="b"
          // eslint-disable-next-line max-len
          d="M13.538 0c1.834 0 3.587.354 5.26 1.067 1.674.71 3.116 1.672 4.327 2.884 1.211 1.213 2.173 2.655 2.884 4.327a13.278 13.278 0 0 1 1.069 5.26c0 2.82-.795 5.38-2.385 7.673l6.596 6.597c.475.474.711 1.051.711 1.732 0 .666-.244 1.243-.73 1.73-.487.486-1.065.73-1.73.73-.694 0-1.27-.244-1.733-.73l-6.596-6.577c-2.293 1.59-4.853 2.385-7.673 2.385-1.834 0-3.587-.356-5.26-1.07-1.672-.71-3.114-1.672-4.327-2.883-1.212-1.211-2.173-2.653-2.884-4.327A13.268 13.268 0 0 1 0 13.538c0-1.834.354-3.587 1.067-5.26.71-1.672 1.672-3.114 2.884-4.327 1.213-1.212 2.655-2.173 4.327-2.884A13.275 13.275 0 0 1 13.538 0zm0 4.538c-2.478 0-4.597.881-6.358 2.642-1.76 1.761-2.642 3.88-2.642 6.358 0 2.478.881 4.597 2.642 6.358 1.761 1.76 3.88 2.642 6.358 2.642 2.477 0 4.597-.882 6.357-2.642 1.761-1.761 2.643-3.88 2.643-6.358 0-2.478-.882-4.597-2.643-6.358-1.76-1.76-3.88-2.642-6.357-2.642z"
        />
        <filter
          id="a"
          width="150%"
          height="150%"
          x="-25%"
          y="-21.9%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation="2.5"
          />
          <feColorMatrix
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feMorphology
            in="SourceAlpha"
            radius="1"
            result="shadowSpreadOuter2"
          />
          <feOffset
            dy="3"
            in="shadowSpreadOuter2"
            result="shadowOffsetOuter2"
          />
          <feGaussianBlur
            in="shadowOffsetOuter2"
            result="shadowBlurOuter2"
            stdDeviation=".5"
          />
          <feColorMatrix
            in="shadowBlurOuter2"
            result="shadowMatrixOuter2"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter3" />
          <feGaussianBlur
            in="shadowOffsetOuter3"
            result="shadowBlurOuter3"
            stdDeviation="1"
          />
          <feColorMatrix
            in="shadowBlurOuter3"
            result="shadowMatrixOuter3"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="shadowMatrixOuter2" />
            <feMergeNode in="shadowMatrixOuter3" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path d="M0 0h32v32H0z" />
        <g>
          <use filter="url(#a)" xlinkHref="#b" />
          <use xlinkHref="#b" />
          <use fillOpacity=".07" xlinkHref="#b" />
        </g>
        <path
          className={iconStyle}
          // search path
          d={`M13.538 0c1.834 0 3.587.354 5.26 1.067 1.674.71 3.116 1.672 4.327 2.884 1.211 1.213 2.173 2.655 2.884 
            4.327a13.278 13.278 0 0 1 1.069 5.26c0 2.82-.795 5.38-2.385 7.673l6.596 6.597c.475.474.711 1.051.711 1.732 
            0 .666-.244 1.243-.73 1.73-.487.486-1.065.73-1.73.73-.694 0-1.27-.244-1.733-.73l-6.596-6.577c-2.293 
            1.59-4.853 2.385-7.673 2.385-1.834 0-3.587-.356-5.26-1.07-1.672-.71-3.114-1.672-4.327-2.883-1.212-1.211-2.173-2.653-2.884-4.327A13.268 
            13.268 0 0 1 0 13.538c0-1.834.354-3.587 1.067-5.26.71-1.672 1.672-3.114 2.884-4.327 1.213-1.212 2.655-2.173 
            4.327-2.884A13.275 13.275 0 0 1 13.538 0zm0 4.538c-2.478 0-4.597.881-6.358 2.642-1.76 1.761-2.642 3.88-2.642 6.358 0 2.478.881 
            4.597 2.642 6.358 1.761 1.76 3.88 2.642 6.358 2.642 2.477 0 4.597-.882 6.357-2.642 1.761-1.761 2.643-3.88 2.643-6.358 
            0-2.478-.882-4.597-2.643-6.358-1.76-1.76-3.88-2.642-6.357-2.642z`}
        />
      </g>
    </svg>
  </div>
);

SearchMenuIcon.propTypes = {
  className: PropTypes.string,
  iconStyle: PropTypes.string
};

export { SearchMenuIcon };
