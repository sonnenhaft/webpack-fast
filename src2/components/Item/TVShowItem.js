import React from 'react';
import PropTypes from 'prop-types';
import AssetItem from './AssetItem';

const TVShowItem = props => (
  <AssetItem
    type="tvshow"
    showProgressBar
    {...props}
    item={{ type: 'series-details', ...(props.item || {}) }}
  />
);

TVShowItem.propTypes = {
  item: PropTypes.object
};

export default TVShowItem;
