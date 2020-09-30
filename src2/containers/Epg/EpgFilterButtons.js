import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import HoverButtonMenu from '#/components/HoverButtonMenu/HoverButtonMenu';
import { FilterIcon, TodayIcon } from '#/components/Icons';

import {
  getEpgDisplayedDateRange,
  getEpgQueryDateRange,
  getEpgUnixDateRange,
  ONE_HOUR_IN_MS
} from '#/helpers/timeHelpers';

import { noop } from '#/helpers';

import { filterButtonIconStyle } from './epgContainer.scss';

const epgQueryDateRange = getEpgQueryDateRange();
const epgUnixDateRange = getEpgUnixDateRange();

const customIconStyle = {
  iconStyle: filterButtonIconStyle
};

const EpgFilterButtons = ({
  dateFilterIndex,
  dateLabel,
  epgCategories = [],
  filterShowingText,
  lazyloadFilteredData = noop,
  messages = {},
  setDateFilterIndex = noop,
  setDateLabel,
  setDisplayStartTime = noop,
  setEndTime = noop,
  setSelectedCategoryForQuery = noop,
  setStartTime = noop
}) => {
  const { todayText, tomorrowText, yesterday } = messages;
  const [, , , ...originalDates] = getEpgDisplayedDateRange();
  const epgDisplayedDateRange = [
    yesterday,
    todayText,
    tomorrowText,
    ...originalDates
  ];

  const epgDisplayCategories = epgCategories?.map(
    ({ displayText }) => displayText
  );
  const epgQueryCategories = epgCategories?.map(({ category }) => category);
  const [categoryFilterIndex, setCategoryFilterIndex] = useState(0);

  const adjustedEndDateIndex = dateIndex =>
    dateIndex === epgDisplayedDateRange.length - 1 ? dateIndex : dateIndex + 1;
  const adjustedStartDateIndex = dateIndex =>
    dateIndex === 0 ? dateIndex : dateIndex - 1;

  const moveEpgHelper = ({ endIndex, indexSelected, startIndex }) => {
    setDateFilterIndex(indexSelected);
    setDateLabel(epgDisplayedDateRange[indexSelected]);
    lazyloadFilteredData({
      variables: {
        category: epgQueryCategories[categoryFilterIndex],
        dateFrom: epgQueryDateRange[startIndex],
        dateTo: epgQueryDateRange[endIndex]
      }
    });
    setDisplayStartTime(epgUnixDateRange[indexSelected] - ONE_HOUR_IN_MS);
    setStartTime(epgUnixDateRange[startIndex]);
    setEndTime(epgUnixDateRange[endIndex]);
  };

  const setSelectedDate = dateIndex => {
    moveEpgHelper({
      endIndex: adjustedEndDateIndex(dateIndex) + (!dateIndex ? 1 : 0),
      indexSelected: dateIndex,
      startIndex: dateIndex > 2 ? 1 : adjustedStartDateIndex(dateIndex)
    });
    setSelectedCategoryForQuery(epgDisplayedDateRange[dateIndex]);
  };

  const setSelectedCategory = categoryIndex => {
    setCategoryFilterIndex(categoryIndex);
    lazyloadFilteredData({
      variables: {
        category: epgQueryCategories[categoryIndex],
        dateFrom: epgQueryDateRange[adjustedStartDateIndex(dateFilterIndex)],
        dateTo: epgQueryDateRange[adjustedEndDateIndex(dateFilterIndex)]
      }
    });
    setSelectedCategoryForQuery(epgQueryCategories[categoryIndex]);
  };

  return (
    <Fragment>
      <HoverButtonMenu
        isMenuRightAligned
        customIconStyle={customIconStyle}
        displayText={dateLabel}
        icon={TodayIcon}
        selectionData={epgDisplayedDateRange}
        selectedIndex={dateFilterIndex}
        setSelectedIndex={setSelectedDate}
      />
      <HoverButtonMenu
        isMenuRightAligned
        customIconStyle={customIconStyle}
        displayText={filterShowingText}
        icon={FilterIcon}
        selectionData={epgDisplayCategories}
        selectedIndex={categoryFilterIndex}
        setSelectedIndex={setSelectedCategory}
      />
    </Fragment>
  );
};

EpgFilterButtons.propTypes = {
  dateFilterIndex: PropTypes.number,
  dateLabel: PropTypes.string,
  epgCategories: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      displayText: PropTypes.string
    })
  ),
  filterShowingText: PropTypes.string,
  lazyloadFilteredData: PropTypes.func,
  messages: PropTypes.object,
  setDateLabel: PropTypes.func,
  setDateFilterIndex: PropTypes.func,
  setDisplayStartTime: PropTypes.func,
  setEndTime: PropTypes.func,
  setSelectedCategoryForQuery: PropTypes.func,
  setStartTime: PropTypes.func
};

export default EpgFilterButtons;
