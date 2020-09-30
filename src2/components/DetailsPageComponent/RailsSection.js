import React from 'react';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';

import Container from '#/containers/Container/Container';

import {
  containerTitleCustomClass,
  customInnerContainerClass
} from './railsSection.scss';

const RailsSection = ({ railsArray = [], railsContainerClass }) => (
  <div className={railsContainerClass}>
    {railsArray.map(({ displayText, ...singleRailProps }) => (
      <Container
        containerTitleCustomClass={containerTitleCustomClass}
        customInnerContainerClass={customInnerContainerClass}
        displayText={displayText}
        key={`${displayText}-rail`}
        {...singleRailProps}
      />
    ))}
  </div>
);

RailsSection.propTypes = {
  railsArray: PropTypes.arrayOf(
    PropTypes.shape({ displayText: PropTypes.string })
  ),
  railsContainerClass: PropTypes.string
};

export default React.memo(RailsSection, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
);
