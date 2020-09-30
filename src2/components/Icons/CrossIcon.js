import React from 'react';
import PropTypes from 'prop-types';

const CrossIcon = ({ iconContainer, onClick }) => (
  <div className={iconContainer} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H16V16H0z" />
        <path
          fill="#EEE"
          d="M12.568 1.417c.556-.556 1.458-.556 2.015 0 .556.557.556 1.459 0 2.015L10.015 8l4.568 4.568c.521.521.554 1.347.097 1.906l-.097.109c-.557.556-1.459.556-2.015 0L8 10.015l-4.568 4.568c-.521.521-1.347.554-1.906.097l-.109-.097c-.556-.557-.556-1.459 0-2.015L5.985 8 1.417 3.432C.896 2.911.863 2.085 1.32 1.526l.097-.109c.557-.556 1.459-.556 2.015 0L8 5.985z"
        />
      </g>
    </svg>
  </div>
);

CrossIcon.propTypes = {
  iconContainer: PropTypes.string,
  onClick: PropTypes.func
};

export { CrossIcon };
