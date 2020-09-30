import React from 'react';
import PropTypes from 'prop-types';

// defined svg within JSX here to reduce request time and transfer time, instead of making a separate request for the image
const Chevron = ({
  className = '',
  iconClassName = '',
  iconPathClassName = '',
  onClick
}) => (
  <div className={className} onClick={onClick}>
    <svg
      className={iconClassName}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="24"
      height="25"
      viewBox="0 0 24 25"
    >
      <defs>
        <path
          id="prefix__a"
          d="M22.536 5.99c.63.627.546 1.667-.114 2.327l-8.95 8.94c-.383.383-.893.571-1.377.54a1.787 1.787 0 01-1.342-.54l-8.95-8.94c-.661-.66-.743-1.7-.115-2.326.66-.596 1.669-.547 2.33.113l8.093 8.085 8.095-8.085c.66-.66 1.701-.741 2.33-.114z"
        />
      </defs>
      <g className={iconPathClassName} fill="none" fillRule="evenodd">
        <path d="M0.727 0H24V23.25H0.727z" transform="translate(0 1)" />
        <g transform="translate(0 1) rotate(90 12.112 11.68)">
          <use fill="#12171B" xlinkHref="#prefix__a" />
          <use fill="#FFF" fillOpacity=".07" xlinkHref="#prefix__a" />
        </g>
        <path
          fill="white"
          // arrow path
          d="M17.803 22.104c-.627.63-1.667.547-2.327-.114l-8.94-8.95a1.804 1.804 0 01-.54-1.376 1.787 1.787 0 01.54-1.342l8.94-8.951c.66-.66 1.7-.743 2.327-.115.596.661.546 1.67-.114 2.33L9.604 11.68l8.085 8.095c.66.66.742 1.701.114 2.33z"
          transform="translate(0 1)"
        />
      </g>
    </svg>
  </div>
);

Chevron.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  iconPathClassName: PropTypes.string,
  onClick: PropTypes.func
};

export { Chevron };
