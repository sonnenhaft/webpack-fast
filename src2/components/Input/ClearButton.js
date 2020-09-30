import React from 'react';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';

const ClearButton = ({ onClick = noop, containerStyle, iconStyle }) => {
  return (
    <div className={containerStyle} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <g fill="none" fillRule="evenodd">
          <path d="M0 0H16V16H0z" />
          <path
            className={iconStyle}
            d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.94 3.184a1.097 1.097 0 00-1.55 0L8.061 6.51 5.735 4.184a1.097 1.097 0 10-1.551 1.551L6.51 8.062 4.184 10.39l-.086.096a1.097 1.097 0 00.086 1.456l.095.085c.43.341 1.058.313 1.456-.085l2.327-2.328 2.327 2.328a1.097 1.097 0 001.552-1.552L9.613 8.062l2.328-2.327.085-.096a1.097 1.097 0 00-.085-1.455z"
          />
        </g>
      </svg>
    </div>
  );
};

ClearButton.propTypes = {
  containerStyle: PropTypes.string,
  iconStyle: PropTypes.string,
  onClick: PropTypes.func
};

export default ClearButton;
