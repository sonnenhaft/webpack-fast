import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Carousel } from '@accedo/vdkweb-carousel';

import { itemSizeMap } from '#/utils/itemHelper';
import { getItemsMap } from '#/components/utils/itemsMap';
import { withTheme } from '#/theme/Theme';
import { Chevron } from '#/components/Icons';

import styles from './shelf.scss';

const TEMPLATE_HERO = 'hero-banner';

const getOptionsForTemplate = () => {
  return {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 7500,
    centerMode: true,
    centerPadding: '16%',
    slidesToShow: 2.3,
    slidesToScroll: 1,
    itemWidth: 'auto',
    itemHeight: '36.25vw',
    arrows: true,
    prevArrow: <Chevron />,
    nextArrow: <Chevron />
  };
};

const gradient =
  'linear-gradient(0deg, rgba(0,0,0,0.2847514005602241) 0%, rgba(0,0,0,0.7133228291316527) 88%)';

const getBackgroundStyle = imgUrl => ({
  backgroundImage: `${gradient}, url("${imgUrl}")`
});

const getImageUrl = ({ image } = {}) => image || '';

const HeroShelf = ({
  action,
  buildOVPLink,
  config,
  itemType,
  items,
  templates,
  theme
}) => {
  if (!items.length) {
    return <span>No items to show</span>;
  }

  const lastIndex = items.length - 1;

  const [currentItem, setCurrentItem] = useState(items[lastIndex]);

  const imgUrl = getImageUrl(currentItem);

  const { OVPItemType } = templates;

  const Item = getItemsMap(OVPItemType)[itemType];

  const { width, height } = { ...itemSizeMap[itemType], ...config.itemOptions };
  const carouselOptions = {
    itemWidth: width,
    itemHeight: height,
    afterChange: (_, index) =>
      setCurrentItem(items[index - 1] || items[lastIndex]),
    ...getOptionsForTemplate(),
    ...config.carouselOptions
  };

  return (
    <Fragment>
      <div className={styles.backDrop} style={getBackgroundStyle(imgUrl)} />
      <div className={classnames(styles[theme.name], styles.mainBanner)}>
        <Carousel
          items={items}
          displayObject={
            <Item
              action={action}
              buildOVPLink={buildOVPLink}
              isHeroShelfItem
              template={TEMPLATE_HERO}
              templates={templates}
              type={itemType}
            />
          }
          keyProperty="id"
          options={carouselOptions}
        />
      </div>
    </Fragment>
  );
};

HeroShelf.propTypes = {
  action: PropTypes.string,
  buildOVPLink: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  itemType: PropTypes.string,
  items: PropTypes.array.isRequired,
  templates: PropTypes.object.isRequired,
  theme: PropTypes.object
};

HeroShelf.defaultProps = {
  config: {},
  items: []
};

export default withTheme(HeroShelf);
