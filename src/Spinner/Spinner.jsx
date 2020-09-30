import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  spinner,
  leftSpinnerDot,
  middleSpinnerDot,
  rightSpinnerDot
} from './spinner.scss';

const Spinner = ({ className }) => (
  <div className={classnames(spinner, { [className]: Boolean(className) })}>
    <div className={leftSpinnerDot} />
    <div className={middleSpinnerDot} />
    <div className={rightSpinnerDot} />
  </div>
);

Spinner.propTypes = {
  className: PropTypes.string
};

export default Spinner;
