import React from 'react';
import PropTypes from 'prop-types';

import PageTitle from '#/components/PageTitle/PageTitle';

import {
  buttonSectionDesktop,
  buttonSectionMobile,
  listingContainer,
  listingHeader,
  listingTitle,
  seperator
} from './assetListing.scss';

const ListingContainer = ({
  buttonSection,
  children,
  displayText = '',
  title = ''
}) => (
  <div className={listingContainer}>
    <div className={listingHeader}>
      <PageTitle text={displayText || title} className={listingTitle} />
      <div className={buttonSectionDesktop}>{buttonSection}</div>
    </div>
    <div className={seperator} />
    <div className={buttonSectionMobile}>{buttonSection}</div>
    {children}
  </div>
);

ListingContainer.propTypes = {
  buttonSection: PropTypes.node,
  children: PropTypes.node,
  displayText: PropTypes.string,
  title: PropTypes.string
};

export default ListingContainer;
