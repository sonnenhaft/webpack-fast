import React from 'react';
import PropTypes from 'prop-types';

const StartOverIcon = ({
  iconContainer = '',
  iconStyle = '',
  svgIconStyle = ''
}) => (
  <div className={iconContainer}>
    <svg
      className={svgIconStyle}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path
        className={iconStyle}
        fillRule="evenodd"
        // eslint-disable-next-line max-len
        d="M17.133 1C25.329 1 32 7.755 32 16.059c0 8.302-6.669 15.059-14.867 15.059-2.436 0-4.852-.61-6.989-1.767-.76-.41-1.045-1.364-.642-2.133.406-.768 1.349-1.06 2.106-.649 1.688.911 3.596 1.392 5.523 1.392 6.48 0 11.753-5.34 11.753-11.904S23.614 4.155 17.132 4.155c-5.896 0-10.778 4.427-11.611 10.169h1.662c.427 0 .59.3.363.666L4.24 20.284c-.228.368-.604.368-.831 0L.104 14.99c-.23-.366-.066-.666.361-.666h1.91C3.228 6.836 9.517 1 17.134 1zm-3.806 10.226c0-.783.845-1.272 1.502-.88l7.887 4.795c.657.39.657 1.37 0 1.662L14.83 21.6c-.658.391-1.502-.097-1.502-.88z"
      />
    </svg>
  </div>
);

StartOverIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string,
  svgIconStyle: PropTypes.string
};

export { StartOverIcon };
