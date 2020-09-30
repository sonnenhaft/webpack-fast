import React from 'react';
import PropTypes from 'prop-types';

const FavouriteFilledIcon = ({ iconContainer = '', iconStyle = '' }) => (
  <div className={iconContainer}>
    <svg
      className={iconStyle}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path
        fill="#EEE"
        fillRule="evenodd"
        d="M22.165 4C26.474 4 30 7.617 30 12.036c0 8.436-12.927 16.518-13.493 16.83-.131.089-.305.134-.435.134L16 28.994l-.072.006c-.098 0-.22-.026-.33-.076l-.105-.058C14.927 28.554 2 20.472 2 12.036 2 7.616 5.526 4 9.835 4c2.394 0 4.614 1.116 6.093 2.99l.008-.008-.008.01C17.407 5.119 19.77 4 22.165 4z"
      />
    </svg>
  </div>
);

FavouriteFilledIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { FavouriteFilledIcon };
