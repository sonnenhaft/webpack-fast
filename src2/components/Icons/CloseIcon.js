import React from 'react';

import PropTypes from 'prop-types';

const CloseIcon = ({ className, iconStyle }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" />
        <path
          className={iconStyle}
          // eslint-disable-next-line max-len
          d="M2.223 2.029c.781-.781 2.048-.781 2.829 0L12 8.977l6.948-6.948c.74-.74 1.916-.779 2.702-.117l.127.117.194.194c.781.781.781 2.048 0 2.829L15.023 12l6.948 6.948c.74.74.779 1.916.117 2.702l-.117.127-.194.194c-.781.781-2.048.781-2.829 0L12 15.023l-6.948 6.948c-.74.74-1.916.779-2.702.117l-.127-.117-.194-.194c-.781-.781-.781-2.048 0-2.829L8.977 12 2.029 5.052c-.74-.74-.779-1.916-.117-2.702l.117-.127z"
        />
      </g>
    </svg>
  );
};

CloseIcon.propTypes = {
  className: PropTypes.string,
  iconStyle: PropTypes.string
};

export { CloseIcon };
