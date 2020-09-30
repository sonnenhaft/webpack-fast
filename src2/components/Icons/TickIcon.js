import React from 'react';
import PropTypes from 'prop-types';

const TickIcon = ({ iconContainer }) => (
  <div className={iconContainer}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H16V16H0z" />
        <path
          fill="#73C20E"
          d="M13.03 1.522c.3-.508.951-.674 1.453-.37.503.302.667.96.367 1.467L6.726 15l-5.38-5.445c-.433-.398-.464-1.075-.07-1.512.394-.437 1.064-.469 1.497-.07l3.462 3.678 6.796-10.129z"
        />
      </g>
    </svg>
  </div>
);

TickIcon.propTypes = {
  iconContainer: PropTypes.string
};

export { TickIcon };
