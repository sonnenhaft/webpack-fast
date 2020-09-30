import React from 'react';
import PropTypes from 'prop-types';

const FavouriteIcon = ({ iconContainer = '', iconStyle = '' }) => (
  <div className={iconContainer}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 32 32"
    >
      <path
        className={iconStyle}
        fillRule="evenodd"
        // eslint-disable-next-line max-len
        d="M15.928 6.99C17.407 5.119 19.771 4 22.165 4 26.474 4 30 7.617 30 12.036c0 8.16-12.093 15.987-13.399 16.774l-.094.056c-.131.089-.305.134-.435.134L16 28.993l-.072.007c-.098 0-.22-.026-.33-.076l-.275-.16C13.687 27.758 2 20.057 2 12.036 2 7.616 5.526 4 9.835 4c2.394 0 4.614 1.116 6.093 2.99zm2.175 1.75l-2.174 2.757-2.205-2.794c-.967-1.225-2.385-1.925-3.89-1.925-2.74 0-5.034 2.353-5.034 5.258 0 2.75 2.078 6.068 5.663 9.448 1.742 1.643 3.815 3.24 5.215 4.204l.32.218.648-.443c1.295-.914 3.048-2.278 4.593-3.702l.298-.277c3.585-3.38 5.663-6.698 5.663-9.448 0-2.905-2.294-5.258-5.035-5.258-1.445 0-2.888.642-3.833 1.69l-.195.23-.811-.631.777.673z"
      />
    </svg>
  </div>
);

FavouriteIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { FavouriteIcon };
