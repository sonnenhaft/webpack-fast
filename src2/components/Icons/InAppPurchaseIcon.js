import React from 'react';
import PropTypes from 'prop-types';

const InAppPurchaseIcon = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
  >
    <g fill="none" fillRule="evenodd">
      <path d="M0 0H24V24H0z" />
      <path
        fill="#EEE"
        // eslint-disable-next-line max-len
        d="M3.938 12.394c.733 0 1.329.585 1.329 1.303 0 .719-.596 1.303-1.329 1.303-.732 0-1.328-.584-1.328-1.303 0-.718.596-1.303 1.328-1.303zm8.994 0c.732 0 1.328.585 1.328 1.303 0 .719-.596 1.303-1.328 1.303-.732 0-1.328-.584-1.328-1.303 0-.718.596-1.303 1.328-1.303zM3.434 1c.37 0 .685.247.766.6l.335 1.457h9.678c.264 0 .508.128.654.342.147.214.174.483.072.72l-1.497 3.528c-.1.234-.31.405-.564.457L6.019 9.506l.14.605h7.456c.433 0 .786.344.786.768 0 .424-.353.769-.786.769H5.53c-.37 0-.686-.247-.768-.6L2.804 2.536H1.786c-.433 0-.786-.344-.786-.768C1 1.345 1.353 1 1.786 1zm9.603 3.594H4.889l.785 3.414 6.475-1.324.888-2.09z"
      />
    </g>
  </svg>
);

InAppPurchaseIcon.propTypes = {
  className: PropTypes.string
};

export { InAppPurchaseIcon };
