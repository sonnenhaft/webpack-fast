import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '#/components/Button/Button';
import { TickIcon } from '#/components/Icons';

import { noop } from '#/helpers';

import {
  categoriesContainer,
  categoryButton,
  categoryMenu,
  categoryMenuItem,
  rightAligned,
  tickIconContainer
} from './hoverButtonMenu.scss';

const MOCK_CATEGORIES = [
  'All categories',
  'International Ethnic',
  'Sport',
  'Kids',
  'Education & Lifestyle',
  'Entertainment',
  'Movies',
  'News'
].map((item, index) => (index ? `${index}00 ${item}` : item));

const HoverButtonMenu = ({
  customCategoryMenuClassName,
  customIconStyle,
  displayText = '',
  icon,
  isMenuRightAligned,
  selectionData = MOCK_CATEGORIES,
  selectedIndex,
  setSelectedIndex
}) => {
  const categoryItems = selectionData.map((text, categoryIndex) => {
    const onSelectCategoryItems = () => setSelectedIndex(categoryIndex);

    return (
      <div
        key={text}
        className={categoryMenuItem}
        onClick={onSelectCategoryItems}
      >
        {text}
        {selectedIndex === categoryIndex && (
          <TickIcon iconContainer={tickIconContainer} />
        )}
      </div>
    );
  });
  const hasDropdownShown = categoryItems?.length > 1;
  const categoryMenuClass = classNames(
    categoryMenu,
    customCategoryMenuClassName,
    {
      [rightAligned]: isMenuRightAligned
    }
  );

  return (
    <div className={categoriesContainer}>
      <Button
        dark
        className={categoryButton}
        onClick={noop}
        displayText={displayText}
        customIconStyle={customIconStyle}
        {...hasDropdownShown && { Icon: icon }}
      />
      {hasDropdownShown && (
        <div className={categoryMenuClass}>{categoryItems}</div>
      )}
    </div>
  );
};

HoverButtonMenu.propTypes = {
  customCategoryMenuClassName: PropTypes.string,
  customIconStyle: PropTypes.object,
  displayText: PropTypes.string,
  icon: PropTypes.func,
  isMenuRightAligned: PropTypes.bool,
  selectionData: PropTypes.array,
  selectedIndex: PropTypes.number,
  setSelectedIndex: PropTypes.func
};

export default HoverButtonMenu;
