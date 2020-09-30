import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AuthContext } from '#/utils/context';

import AssetItemWithoutLink from './AssetItemWithoutLink';
import toCamelCase from '#/utils/toCamelCase';
import { getColorForItem, imageResizer } from '#/utils/itemHelper';

import { getEntitlement, noop } from '#/helpers';
import { ROUTE } from '#/constants';

import ViewMoreItem from './ViewMoreItem';

import { getCtaAction } from './bannerCtaHelper';

import styles from './item.scss';

const { ASSET_LISTING, DETAILS_LISTING } = ROUTE;

const {
  content,
  heroBannerExternalLink,
  heroItemCard,
  itemCard,
  itemText,
  itemTextContainer,
  playerItemText,
  viewMoreIcon,
  viewMoreIconContainer,
  viewMoreItem
} = styles;

const getItemLink = ({
  action,
  AccedoOneItemAction,
  AccedoOneItemActionToRoute,
  item
}) => {
  const { castName, id } = item;
  const { CastCrew, Vod } = AccedoOneItemAction;
  const actionData = action === CastCrew ? castName : id;

  if (AccedoOneItemActionToRoute[action] && actionData) {
    return AccedoOneItemActionToRoute[action].replace(
      ':action-data:',
      actionData
    );
  }

  return AccedoOneItemActionToRoute[Vod].replace(':action-data:', actionData);
};

const getLinkState = ({
  action,
  AccedoOneItemAction: { CastCrew } = {},
  item: { castName } = {}
}) => (action === CastCrew ? { keyword: castName } : {});

const AssetItem = ({
  action,
  buildOVPLink,
  height,
  isHeroShelfItem,
  item: itemProp,
  isPlayerRail,
  messages = {},
  navigateFromPlayer = noop,
  playerEntitlements = {},
  showProgressBar,
  template: itemTemplate,
  templates,
  type,
  width
}) => {
  const { state: { entitlements = {} } = {} } = useContext(AuthContext);
  const {
    isContainerOnDetailsPage,
    categories,
    tvSeasonCount,
    premium,
    productRefs = [],
    railId,
    viewAllItem,
    pseudoItem
  } = itemProp;
  const {
    AccedoOneItemActionToRoute,
    AccedoOneItemAction,
    OVPItemType,
    OVPItemTypeRoutes
  } = templates;

  const { HeroBanner, Listing } = AccedoOneItemAction;
  const { CastCrew, Category, Portrait, Square, Wide } = OVPItemType || {};

  const isUserEntitled = getEntitlement({
    entitlements: isPlayerRail ? playerEntitlements : entitlements,
    productRefs
  });

  const isPremium =
    (!isUserEntitled && type !== CastCrew && !isHeroShelfItem) || premium;

  const { viewMoreText } = messages;

  const itemStyle = { width, height };

  const itemLinkRoute = `${
    isContainerOnDetailsPage ? DETAILS_LISTING : ASSET_LISTING
  }/${railId}`;

  if (pseudoItem) {
    return <div style={{ pointerEvents: 'none' }} />;
  }

  if (viewAllItem) {
    return (
      <Link to={itemLinkRoute} style={{ textDecoration: 'none' }}>
        <div className={`${itemCard} ${viewMoreItem}`} style={itemStyle}>
          <ViewMoreItem
            iconContainer={viewMoreIconContainer}
            iconStyle={viewMoreIcon}
          />
          <span>{viewMoreText}</span>
        </div>
      </Link>
    );
  }

  const item = { ...itemProp };

  // adapt to both images and image attributes.
  // return images or image attribute and fallback to empty array.
  const images = [...(item.images || [])];

  const { url, fileUrl } = images[0] || {};
  const imageUrl = url || fileUrl || item.image;
  const imageUrlWithSpaceEncoding = imageUrl && encodeURI(imageUrl);

  const imageSrc = isHeroShelfItem
    ? imageUrlWithSpaceEncoding
    : imageResizer({ url: imageUrlWithSpaceEncoding, width });

  const templateClassName = styles[toCamelCase(itemTemplate)] || '';
  const typeClassName = styles[type] || '';
  const itemContainerClass = classNames(
    itemCard,
    templateClassName,
    typeClassName,
    {
      [heroItemCard]: isHeroShelfItem
    }
  );
  const itemInnerContentClass = classNames(content, itemTextContainer);
  const itemInnerContentTextClass = classNames(itemText, {
    [playerItemText]: isPlayerRail
  });

  if (type === Portrait) {
    item.subTitle = categories
      ? categories
          .slice(0, 2)
          .map(category => category.title)
          .join(', ')
      : '';
  } else if (type === Wide) {
    // if it has season info, then we use it as subtitle.
    item.subTitle = tvSeasonCount ? `Season ${tvSeasonCount}` : '';
  } else if ([Category, Square].includes(type)) {
    itemStyle.backgroundColor = getColorForItem(item);
  }

  const link = getItemLink({
    action,
    AccedoOneItemAction,
    AccedoOneItemActionToRoute,
    OVPItemType,
    OVPItemTypeRoutes,
    buildOVPLink,
    item,
    type
  });
  const assetItemProps = {
    action,
    item,
    itemContainerClass,
    itemInnerContentClass,
    itemInnerContentTextClass,
    itemStyle,
    navigateFromPlayer,
    showProgressBar: type === 'castcrew' ? false : showProgressBar,
    templates,
    itemImageUrl: imageSrc,
    premium: isPremium
  };
  const { ctaLink, isExternalLink } =
    (action === HeroBanner || action === Listing) &&
    getCtaAction({ AccedoOneItemActionToRoute, item });

  if (isExternalLink) {
    return (
      <a className={heroBannerExternalLink} href={ctaLink}>
        <AssetItemWithoutLink {...assetItemProps} />
      </a>
    );
  }

  return (
    <Fragment>
      {isPlayerRail ? (
        <AssetItemWithoutLink {...assetItemProps} />
      ) : (
        <Link
          className={styles.itemLink}
          to={{
            pathname: ctaLink || link,
            state: getLinkState({ action, AccedoOneItemAction, item })
          }}
        >
          <AssetItemWithoutLink {...assetItemProps} />
        </Link>
      )}
    </Fragment>
  );
};

AssetItem.propTypes = {
  action: PropTypes.string,
  buildOVPLink: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isHeroShelfItem: PropTypes.bool,
  isPlayerRail: PropTypes.bool,
  item: PropTypes.object,
  messages: PropTypes.object,
  navigateFromPlayer: PropTypes.func,
  playerEntitlements: PropTypes.object,
  showProgressBar: PropTypes.bool,
  template: PropTypes.string,
  templates: PropTypes.object.isRequired,
  type: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

AssetItem.defaultProps = {
  type: 'unknown'
};

export default AssetItem;
