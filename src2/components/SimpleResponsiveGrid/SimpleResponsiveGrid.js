import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import _chunk from 'lodash/chunk';

import { gridRow, gridContainer } from './simple-grid.scss';

const ITEM_MARGIN = 10;

const baseStyle = {
  boxSizing: 'border-box',
  marginRight: `${ITEM_MARGIN}px`
};

const useInnerWidth = () => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setInnerWidth(window.innerWidth);

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return innerWidth;
};

const GridRow = ({ Component, containerWidth, items, cols }) => {
  const specialRow = items?.length < cols;

  const itemStyle = {
    ...baseStyle,

    width: specialRow ? containerWidth / cols : '100%'
  };

  return (
    <div
      className={gridRow}
      style={specialRow ? { justifyContent: 'flex-start' } : {}}
    >
      {items.map((data, idx) => (
        <Component key={`item-${idx}`} {...data} style={itemStyle} />
      ))}
    </div>
  );
};

const SimpleGrid = ({
  data,
  itemWidth,
  containerPadding = 0,
  GridItem,
  itemMargin = ITEM_MARGIN
}) => {
  const width = useInnerWidth();
  const cols = Math.floor(width / itemWidth) || 1;
  const rowList = _chunk(data, cols);

  const totalMargin = itemMargin * cols;

  return (
    <div className={gridContainer}>
      {rowList.map((row, idx) => (
        <GridRow
          key={`key-${idx}`}
          Component={GridItem}
          items={row}
          containerWidth={width - containerPadding - totalMargin}
          width={itemWidth}
          cols={cols}
        />
      ))}
    </div>
  );
};

SimpleGrid.propTypes = {
  data: PropTypes.array,
  itemWidth: PropTypes.number,
  containerPadding: PropTypes.number,
  GridItem: PropTypes.func,
  itemMargin: PropTypes.number
};

GridRow.propTypes = {
  Component: PropTypes.func,
  containerWidth: PropTypes.number,
  cols: PropTypes.number,
  items: PropTypes.array
};

export default SimpleGrid;
