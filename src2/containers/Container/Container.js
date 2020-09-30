import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { buildOVPLink } from '#/services/ovp/helpers';
import Shelf from '#/components/Shelf';
import ContainerComp from '#/components/Container/Container';
import * as templates from '#/config/templates';

import {
  XS,
  SM,
  MD,
  LG_TABLET,
  UXGA,
  LG,
  WXGA,
  XL,
  XXL,
  bigNumber
} from '#/theme/variables/breakpoints';

const breakpointsInPixels = [
  XS,
  SM,
  MD,
  LG_TABLET,
  UXGA,
  LG,
  WXGA,
  XL,
  XXL,
  bigNumber
];

const Container = ({ rail, ...props }) => {
  const {
    action,
    cardType,
    fixedPadding,
    id: railId,
    itemType,
    isContainerOnDetailsPage,
    isPlayerRail,
    navigateFromPlayer,
    playerEntitlements,
    showSeeAllCard,
    template
  } = props;
  const [currentBreakpoint, setCurrentBreakpoint] = useState(null);

  const shouldCalculateItemCountOnBrowser = fixedPadding && __CLIENT__;
  const setNewBreakpoint = () => {
    const breakpointSmallerWindow =
      __CLIENT__ &&
      breakpointsInPixels.filter(breakpoint => breakpoint < window.innerWidth);
    const newBreakpoint =
      breakpointSmallerWindow[breakpointSmallerWindow.length - 1];
    if (currentBreakpoint !== newBreakpoint) {
      setCurrentBreakpoint(newBreakpoint);
    }
  };
  setNewBreakpoint();

  useEffect(() => {
    if (shouldCalculateItemCountOnBrowser) {
      window.addEventListener('resize', setNewBreakpoint);
    }

    return () => {
      if (shouldCalculateItemCountOnBrowser) {
        window.removeEventListener('resize', setNewBreakpoint);
      }
    };
  }, []);

  const { totalCount } = rail || {};

  if (!rail?.items || !rail?.items.length) {
    return null;
  }

  const shelfProps = {
    action,
    buildOVPLink,
    cardType,
    currentBreakpoint,
    fixedPadding,
    isContainerOnDetailsPage,
    isPlayerRail,
    itemType,
    navigateFromPlayer,
    playerEntitlements,
    railId,
    showSeeAllCard,
    template,
    totalCount
  };

  return (
    <ContainerComp {...props}>
      <Shelf templates={templates} items={rail?.items} {...shelfProps} />
    </ContainerComp>
  );
};

Container.propTypes = {
  action: PropTypes.string,
  cardType: PropTypes.string,
  fixedPadding: PropTypes.number,
  id: PropTypes.string,
  isPlayerRail: PropTypes.bool,
  isContainerOnDetailsPage: PropTypes.bool,
  itemType: PropTypes.string,
  navigateFromPlayer: PropTypes.func,
  playerEntitlements: PropTypes.object,
  rail: PropTypes.object,
  showSeeAllCard: PropTypes.bool,
  style: PropTypes.object,
  template: PropTypes.string,
  theme: PropTypes.object,
  totalCount: PropTypes.number
};

export default Container;
