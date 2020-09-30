import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from '@accedo/vdkweb-carousel';

import { itemSizeMap } from '#/utils/itemHelper';
import { ConfigContext } from '#/utils/context';
import { getItemsMap } from '#/components/utils/itemsMap';
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
  XXXL,
  XXXL2,
  XXXL3,
  XXXL4,
  XXXL5,
  XXXL6,
  XXXL7,
  bigNumber
} from '#/theme/variables/breakpoints';
import { Chevron } from '#/components/Icons';

const TEMPLATE_CAROUSEL = 'carousel';

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
  XXXL,
  XXXL2,
  XXXL3,
  XXXL4,
  XXXL5,
  XXXL6,
  XXXL7,
  bigNumber
];

const defaultResponsiveItemCount = {
  [XS]: 1.6,
  [SM]: 3,
  [MD]: 4.2,
  [LG_TABLET]: 4.5,
  [UXGA]: 5,
  [LG]: 5.8,
  [WXGA]: 6,
  [XL]: 6.3,
  [XXL]: 7,
  [XXXL]: 8.5,
  [XXXL2]: 10,
  [XXXL3]: 12,
  [XXXL4]: 14,
  [XXXL5]: 15,
  [XXXL6]: 16,
  [XXXL7]: 17,
  [bigNumber]: 19
};

const getResponsiveItemCount = OVPItemType => ({
  [OVPItemType.Wide]: {
    [XS]: 1.3,
    [SM]: 2.5,
    [MD]: 3.2,
    [LG_TABLET]: 3.7,
    [UXGA]: 3.9,
    [LG]: 4.5,
    [WXGA]: 4.9,
    [XL]: 5,
    [XXL]: 5.4,
    [XXXL]: 6.5,
    [XXXL2]: 7.8,
    [XXXL3]: 9,
    [XXXL4]: 10.5,
    [XXXL5]: 11,
    [XXXL6]: 12,
    [XXXL7]: 13,
    [bigNumber]: 16
  }
});

const getResponsiveSettings = ({
  itemType,
  OVPItemType,
  fixedPadding,
  width
}) => {
  const shouldCalculateItemCountOnBrowser = fixedPadding && __CLIENT__;
  const itemCount =
    getResponsiveItemCount(OVPItemType)[itemType] || defaultResponsiveItemCount;
  const calculatedItemCount = () =>
    shouldCalculateItemCountOnBrowser &&
    window.innerWidth / (width + fixedPadding);

  const slidesToShow = breakpoint =>
    shouldCalculateItemCountOnBrowser
      ? calculatedItemCount()
      : itemCount[breakpoint];

  return breakpointsInPixels.map(breakpoint => ({
    breakpoint,
    settings: {
      slidesToShow: slidesToShow(breakpoint),
      slidesToScroll: slidesToShow(breakpoint)
    }
  }));
};

const getOptionsForTemplate = () => {
  return {
    dots: false,
    infinite: false,
    speed: 500,
    draggable: false,
    prevArrow: <Chevron />,
    nextArrow: <Chevron />
  };
};

const CarouselShelf = ({
  action,
  buildOVPLink,
  config,
  currentBreakpoint,
  fixedPadding,
  isContainerOnDetailsPage,
  isPlayerRail,
  items: shelfItems,
  itemType,
  messages = {},
  navigateFromPlayer,
  playerEntitlements,
  railId,
  showSeeAllCard,
  templates,
  totalCount
}) => {
  if (!shelfItems.length) {
    return null;
  }

  const { maxItemsInRail } = useContext(ConfigContext) || {};

  const hasViewMoreItem =
    showSeeAllCard &&
    (totalCount > maxItemsInRail || shelfItems.length > maxItemsInRail);

  const items = hasViewMoreItem
    ? shelfItems.slice(0, maxItemsInRail)
    : shelfItems;

  if (hasViewMoreItem) {
    items.push({
      viewAllItem: true,
      items: shelfItems.slice(maxItemsInRail - 1),
      isContainerOnDetailsPage,
      isPlayerRail,
      railId
    });
  }
  items.push({ pseudoItem: true, isPlayerRail });

  const { OVPItemType } = templates;

  const Item = getItemsMap(OVPItemType)[itemType];

  const { width, height } = { ...itemSizeMap[itemType], ...config.itemOptions };

  const responsive = getResponsiveSettings({
    itemType,
    OVPItemType,
    fixedPadding,
    width
  });
  const slidesToShow =
    responsive[
      responsive.findIndex(
        ({ breakpoint }) => breakpoint === currentBreakpoint
      ) + 1
    ]?.settings?.slidesToShow;

  const carouselOptions = {
    itemWidth: width,
    itemHeight: height,
    responsive,
    arrows: items.length > slidesToShow,
    ...getOptionsForTemplate(),
    ...config.carouselOption
  };

  return (
    <div>
      <Carousel
        items={items}
        displayObject={
          <Item
            action={action}
            buildOVPLink={buildOVPLink}
            height={height}
            isPlayerRail={isPlayerRail}
            messages={messages}
            navigateFromPlayer={navigateFromPlayer}
            playerEntitlements={playerEntitlements}
            showProgressBar={railId === 'continue-watching'}
            template={TEMPLATE_CAROUSEL}
            templates={templates}
            type={itemType}
            width={width}
          />
        }
        key={`${railId}-${currentBreakpoint}`}
        keyProperty="id"
        options={carouselOptions}
      />
    </div>
  );
};

CarouselShelf.propTypes = {
  action: PropTypes.string,
  buildOVPLink: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  currentBreakpoint: PropTypes.number,
  fixedPadding: PropTypes.number,
  isContainerOnDetailsPage: PropTypes.bool,
  isPlayerRail: PropTypes.bool,
  itemType: PropTypes.string,
  items: PropTypes.array.isRequired,
  messages: PropTypes.object,
  navigateFromPlayer: PropTypes.func,
  playerEntitlements: PropTypes.object,
  railId: PropTypes.string,
  showSeeAllCard: PropTypes.bool,
  templates: PropTypes.object.isRequired,
  totalCount: PropTypes.number
};

CarouselShelf.defaultProps = {
  config: {},
  items: []
};

export default CarouselShelf;
