import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  blackProgressBar,
  greenProgressBar,
  progressBar
} from './progressBar.scss';

const ProgressBar = ({
  className = '',
  isBlackProgressBar,
  isGreenProgressBar,
  progressPercent
}) => {
  const progressBarClass = classNames(className, progressBar, {
    [blackProgressBar]: isBlackProgressBar,
    [greenProgressBar]: isGreenProgressBar
  });

  return (
    <progress className={progressBarClass} max="100" value={progressPercent} />
  );
};

ProgressBar.propTypes = {
  className: PropTypes.string,
  isBlackProgressBar: PropTypes.bool,
  isGreenProgressBar: PropTypes.bool,
  progressPercent: PropTypes.number
};

export default ProgressBar;
