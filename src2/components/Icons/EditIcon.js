import React from 'react';
import PropTypes from 'prop-types';

const EditIcon = ({ iconContainer, iconStyle }) => {
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
          className={iconStyle}
          fill="#EEE"
          // eslint-disable-next-line max-len
          d="M21.395 20.29c.61 0 1.105.495 1.105 1.106 0 .61-.494 1.104-1.105 1.104H2.605c-.61 0-1.105-.494-1.105-1.104 0-.61.494-1.106 1.105-1.106zM15.868 5.368c.148 0 .29.059.393.163l2.21 2.21c.105.104.164.245.164.393 0 .147-.06.288-.164.391v.002l-10.5 10.498c-.104.103-.245.16-.393.16h-2.21c-.146 0-.287-.058-.39-.162-.104-.104-.162-.245-.162-.39v-2.21c-.001-.148.057-.289.16-.393l10.5-10.499c.104-.104.245-.163.392-.163zM19.731 1.5c.148 0 .29.058.393.164l2.21 2.21c.105.103.164.244.164.391 0 .148-.06.29-.164.393l-2.21 2.21c-.103.102-.241.16-.387.16-.149.003-.292-.055-.397-.16l-2.212-2.221c-.21-.215-.21-.559 0-.773l2.212-2.211c.103-.105.244-.163.391-.163z"
        />
      </g>
    </svg>
  );
};

EditIcon.propTypes = {
  iconContainer: PropTypes.string,
  iconStyle: PropTypes.string
};

export { EditIcon };
