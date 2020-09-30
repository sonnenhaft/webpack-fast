import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Chevron } from '#/components/Icons';

import {
  categoriesHeader,
  categoriesSidePanel,
  categoriesSidePanelItem,
  chevronIconContainer,
  selectedCategoryItem
} from './assetListing.scss';

const CategorySidePanel = ({
  categories = [],
  changeCategory,
  listingCat,
  selectedCategory = 0
}) => {
  const categoryItems = (categories || []).map(
    ({ displayText, id: categoryId, totalCount = 0 }, categoryIndex) => {
      const categoriesSidePanelItemClass = classNames(categoriesSidePanelItem, {
        [selectedCategoryItem]: selectedCategory === categoryIndex
      });
      const changeCategoryClickFn = () =>
        changeCategory({ categoryId, categoryIndex });

      return (
        <div
          className={categoriesSidePanelItemClass}
          key={displayText}
          onClick={changeCategoryClickFn}
        >
          <span>{`${displayText} (${totalCount})`}</span>
          <Chevron className={chevronIconContainer} />
        </div>
      );
    }
  );

  return (
    <div className={categoriesSidePanel}>
      <div className={categoriesHeader}>
        <span>{listingCat}</span>
      </div>
      {categoryItems}
    </div>
  );
};

CategorySidePanel.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      displayText: PropTypes.string
    })
  ),
  changeCategory: PropTypes.func,
  listingCat: PropTypes.string,
  selectedCategory: PropTypes.number
};

export default CategorySidePanel;
