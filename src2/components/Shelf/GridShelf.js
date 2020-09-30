import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveGrid } from '@accedo/vdkweb-grid';

import { itemSizeMap } from '#/utils/itemHelper';
import { getItemsMap } from '#/components/utils/itemsMap';
import { XXS, XS, SM, MD, LG, XL } from '#/theme/variables/breakpoints';

const TEMPLATE_GRID = 'grid';
const bigNumber = 1000000;
const breakpointsInPixels = [0, XXS, XS, SM, MD, LG, XL, bigNumber];

const getResponsiveSettings = (itemType, OVPItemType) => {
  const columnCount = {
    0: 2,
    [XXS]: 2,
    [XS]: 3,
    [SM]: 4,
    [MD]: {
      [OVPItemType.Portrait]: 5,
      Default: 5
    },
    [LG]: 6,
    [XL]: 6,
    [bigNumber]: 8
  };

  return breakpointsInPixels.reduce(
    (acc, breakpoint) => ({
      ...acc,
      [breakpoint]: {
        columnCount:
          typeof columnCount[breakpoint] === 'object'
            ? columnCount[breakpoint][itemType] ||
              columnCount[breakpoint].Default
            : columnCount[breakpoint]
      }
    }),
    {}
  );
};

const GridShelf = ({
  action,
  buildOVPLink,
  config,
  itemType,
  items,
  railId,
  templates
}) => {
  const { OVPItemType } = templates;

  if (!items.length) {
    return <span>No items to show</span>;
  }

  const Item = getItemsMap(OVPItemType)[itemType];

  const { width, height } = { ...itemSizeMap[itemType], ...config.itemOptions };
  const responsiveSettings = getResponsiveSettings(itemType, OVPItemType);

  return (
    <div>
      <ResponsiveGrid
        items={items}
        displayObject={
          <Item
            action={action}
            buildOVPLink={buildOVPLink}
            template={TEMPLATE_GRID}
            templates={templates}
            type={itemType}
            showProgressBar={railId === 'continue-watching'}
          />
        }
        keyProperty="id"
        itemWidth={width}
        itemHeight={height}
        responsiveSettings={responsiveSettings}
        isAnimated
      />
    </div>
  );
};

GridShelf.propTypes = {
  action: PropTypes.string,
  buildOVPLink: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  itemType: PropTypes.string,
  items: PropTypes.array.isRequired,
  railId: PropTypes.string,
  templates: PropTypes.object.isRequired
};

GridShelf.defaultProps = {
  config: {},
  items: []
};

export default GridShelf;
