import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ConfigContext } from '#/utils/context';
import ShelfContainersIds from './ShelfContainersIds';
import {
  determineItemTypeByTemplate,
  ContainerIdToComponent
} from './templateHelper';

const Shelf = ({
  action,
  cardType,
  config,
  currentBreakpoint,
  fixedPadding,
  isContainerOnDetailsPage,
  items,
  itemType: itemTypeProps,
  isPlayerRail,
  navigateFromPlayer,
  playerEntitlements,
  railId,
  showSeeAllCard,
  template,
  templates,
  totalCount,
  buildOVPLink
}) => {
  const { messages } = useContext(ConfigContext);
  const {
    AccedoOneContainerCardType,
    AccedoOneContainerTemplateMap,
    OVPItemType
  } = templates;

  if (!AccedoOneContainerTemplateMap[template]) {
    console.warn(`Template "${template}" is not supported`);

    return null;
  }

  const containerId =
    cardType === AccedoOneContainerCardType.Banner
      ? AccedoOneContainerTemplateMap.hero
      : AccedoOneContainerTemplateMap[template] || ShelfContainersIds.Default;
  const ShelfComponent =
    ContainerIdToComponent[containerId] || ContainerIdToComponent.Default;
  const itemType =
    itemTypeProps || determineItemTypeByTemplate({ cardType, OVPItemType });

  const playerRailProps = isPlayerRail ? { isPlayerRail } : { messages };

  const nonNullItems = items?.filter(Boolean);

  return (
    <ShelfComponent
      action={action}
      buildOVPLink={buildOVPLink}
      config={{ ...config, template }}
      currentBreakpoint={currentBreakpoint}
      fixedPadding={fixedPadding}
      isContainerOnDetailsPage={isContainerOnDetailsPage}
      items={nonNullItems}
      itemType={itemType}
      navigateFromPlayer={navigateFromPlayer}
      playerEntitlements={playerEntitlements}
      railId={railId}
      showSeeAllCard={showSeeAllCard}
      templates={templates}
      totalCount={totalCount}
      {...playerRailProps}
    />
  );
};

Shelf.propTypes = {
  action: PropTypes.string,
  buildOVPLink: PropTypes.func,
  cardType: PropTypes.string,
  config: PropTypes.object,
  currentBreakpoint: PropTypes.number,
  fixedPadding: PropTypes.number,
  isContainerOnDetailsPage: PropTypes.bool,
  isPlayerRail: PropTypes.bool,
  items: PropTypes.array,
  itemType: PropTypes.string,
  navigateFromPlayer: PropTypes.func,
  playerEntitlements: PropTypes.object,
  railId: PropTypes.string,
  showSeeAllCard: PropTypes.bool,
  template: PropTypes.string,
  templates: PropTypes.object,
  totalCount: PropTypes.number
};

Shelf.defaultProps = {
  items: []
};

export default Shelf;
