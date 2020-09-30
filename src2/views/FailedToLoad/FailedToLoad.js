import React from 'react';
import PropTypes from 'prop-types';
import styles from '../views.scss';

const FailedToLoad = ({ debugInfo }) => (
  <div className={styles.pageContent}>
    <h2>Failed to Load</h2>
    <div>Unfortunately the page failed to load. Please try again later.</div>
    {debugInfo ? (
      <div>
        <h4>Debug Info</h4>
        {debugInfo?.message || ''}
      </div>
    ) : (
      ''
    )}
  </div>
);

FailedToLoad.propTypes = {
  debugInfo: PropTypes.any
};

export default FailedToLoad;
