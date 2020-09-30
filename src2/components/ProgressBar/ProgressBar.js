import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProgress, defaultProgressBar } from './progressBar.scss';

const ProgressBar = ({
  customProgress,
  customProgressBarStyle,
  progressPercent
}) => {
  const progressBarStyles = classNames(
    defaultProgressBar,
    customProgressBarStyle
  );
  const progressStyles = classNames(defaultProgress, customProgress);

  return (
    <div className={progressBarStyles}>
      <div
        className={progressStyles}
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  customProgress: PropTypes.string,
  customProgressBarStyle: PropTypes.string,
  progressPercent: PropTypes.number
};

export default ProgressBar;
