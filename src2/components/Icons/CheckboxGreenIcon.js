import React from 'react';
import PropTypes from 'prop-types';

const CheckboxGreen = ({ iconContainer = '' }) => {
  return (
    <svg
      className={iconContainer}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" />
        <path
          fill="#73C20E"
          d="M19.7 1.5a2.8 2.8 0 012.8 2.8v15.4a2.8 2.8 0 01-2.8 2.8H4.3a2.8 2.8 0 01-2.8-2.8V4.3a2.8 2.8 0 012.8-2.8h15.4zm.08 2.282a1.264 1.264 0 00-1.743.445L9.882 16.382l-4.155-4.415a1.262 1.262 0 00-1.795.084 1.294 1.294 0 00.083 1.815L10.47 20.4l9.75-14.857c.359-.609.162-1.398-.441-1.761z"
        />
      </g>
    </svg>
  );
};

CheckboxGreen.propTypes = {
  iconContainer: PropTypes.string
};

export { CheckboxGreen };
