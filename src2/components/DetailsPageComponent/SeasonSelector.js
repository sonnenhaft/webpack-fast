import React from 'react';
import PropTypes from 'prop-types';

import HoverButtonMenu from '#/components/HoverButtonMenu/HoverButtonMenu';
import { Chevron } from '#/components/Icons';
import { toLowerCase } from '#/helpers';

import {
  chevronContainer,
  customChevron,
  customChevronPath,
  seasonSelectorContainer
} from './seasonSelector.scss';

const hoverButtonIconStyle = {
  className: chevronContainer,
  iconClassName: customChevron,
  iconPathClassName: customChevronPath
};

const SEASON_UNDEFINED = 'season undefined';

const SeasonSelector = ({ selectionData, ...rest }) => {
  const { length = 0 } = selectionData || [];

  if (toLowerCase(selectionData?.[0]) === SEASON_UNDEFINED || length <= 1) {
    return null;
  }

  return (
    <div className={seasonSelectorContainer}>
      <HoverButtonMenu
        customIconStyle={hoverButtonIconStyle}
        icon={Chevron}
        selectionData={selectionData}
        {...rest}
      />
    </div>
  );
};

SeasonSelector.propTypes = {
  selectionData: PropTypes.array
};

export default SeasonSelector;
