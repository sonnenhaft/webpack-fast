import React from 'react';
import PropTypes from 'prop-types';

const VolumeIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 24"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill="#EEE"
        // eslint-disable-next-line max-len
        d="M17.336 6.019l.002 19.962c0 1.665-2.039 2.614-3.441 1.604l-8.095-5.763H1.85C.83 21.822.002 21.05.002 20.1L0 11.9c0-.952.83-1.722 1.848-1.722h3.951l8.096-5.763c1.401-1.01 3.44-.06 3.44 1.604zm9.883.657C30.152 8.874 32 12.26 32 16.004c0 3.74-1.848 7.125-4.781 9.323-.637.476-1.658.357-2.166-.237-.51-.594-.446-1.546.191-2.019 2.232-1.664 3.633-4.22 3.633-7.07 0-2.852-1.401-5.407-3.633-7.069-.637-.476-.764-1.425-.191-2.02.51-.593 1.529-.712 2.166-.236zm-3.952 4.214c1.594 1.25 2.677 3.09 2.677 5.17 0 2.079-1.083 3.92-2.742 5.168-.637.476-1.658.358-2.166-.237l-.127-.118c-.51-.594-.383-1.425.254-1.843.956-.712 1.594-1.782 1.594-2.97 0-1.19-.573-2.199-1.467-2.911-.702-.534-.83-1.425-.254-2.08.573-.594 1.529-.712 2.231-.179z"
        transform="translate(0 -4)"
      />
      <path d="M0 0H32V32H0z" transform="translate(0 -4)" />
    </g>
  </svg>
);

VolumeIcon.propTypes = {
  className: PropTypes.string
};

export { VolumeIcon };
