import React from 'react';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';
import { ASSET_ITEM_TYPENAME, ROUTE } from '#/constants';
import premiumSvg from '#/static/images/premium.svg';

import styles from './item.scss';

const { editorial, nagraProgram } = ASSET_ITEM_TYPENAME;
const { LINEAR_DETAILS, MOVIE_DETAILS } = ROUTE;

const {
  itemCastName,
  itemCastTitle,
  itemImage,
  itemSubtitle,
  premiumIcon,
  progressBar
} = styles;

const getWatchProgress = ({
  AccedoOneItemAction,
  action,
  duration,
  period,
  position
}) => {
  const { Linear, Vod } = AccedoOneItemAction;
  const { end, start } = period || {};

  switch (action) {
    case Linear:
    case 'recommend-linear':
      return ((Date.now() / 1000 - start) / (end - start)) * 100;

    case Vod:
    case 'recommend-vod':
      return (position / duration) * 100;

    default:
      return null;
  }
};

const PremiumIcon = ({ className }) => (
  <img src={premiumSvg} alt="premium content" className={className} />
);

const ProgressBar = ({ progressPercent = 0 }) => {
  const percent = progressPercent > 100 ? 100 : progressPercent;
  const progress = Number.isNaN(percent) ? 0 : percent * 0.91;

  return <progress className={progressBar} max="100" value={progress} />;
};

const typenameToRoute = ({ id, typename }) => {
  switch (typename) {
    case editorial:
      return MOVIE_DETAILS.replace(':id', id);

    case nagraProgram:
      return LINEAR_DETAILS.replace(':id', id);

    default:
      return '';
  }
};

const AssetItemWithoutLink = ({
  action,
  item,
  itemContainerClass,
  itemImageUrl,
  itemInnerContentClass,
  itemInnerContentTextClass,
  itemStyle,
  navigateFromPlayer = noop,
  premium,
  showProgressBar,
  templates
}) => {
  const {
    __typename,
    castName,
    castTitle,
    duration,
    displayText,
    episodeDisplayTitle,
    id,
    period,
    position,
    subTitle,
    title = ''
  } = item;
  const { height, width } = itemStyle;
  const { AccedoOneItemAction } = templates;
  const watchProgress = getWatchProgress({
    AccedoOneItemAction,
    action,
    duration,
    period,
    position
  });
  const playerRailItemsRoute = typenameToRoute({ id, typename: __typename });
  const onClickAssetItemWithoutLink = () =>
    navigateFromPlayer(playerRailItemsRoute);

  // TODO Refactor to use <article> or <section>
  return (
    <div
      className={itemContainerClass}
      style={itemStyle}
      {...playerRailItemsRoute && { onClick: onClickAssetItemWithoutLink }}
    >
      {itemImageUrl && (
        <img
          className={itemImage}
          src={itemImageUrl}
          alt={title}
          height={height}
          width={width}
        />
      )}
      <span className={itemInnerContentClass} style={{ width, height }}>
        {premium && <PremiumIcon className={premiumIcon} />}
        {showProgressBar && <ProgressBar progressPercent={watchProgress} />}
        <h3 className={itemInnerContentTextClass}>
          {displayText || episodeDisplayTitle || title}
        </h3>
        <h4 className={itemSubtitle}>{subTitle}</h4>
      </span>
      <h3 className={itemCastName}>{castName}</h3>
      <h4 className={itemCastTitle}>{castTitle}</h4>
    </div>
  );
};

ProgressBar.propTypes = {
  progressPercent: PropTypes.number
};

PremiumIcon.propTypes = {
  className: PropTypes.string
};

AssetItemWithoutLink.propTypes = {
  itemImageUrl: PropTypes.string
};

AssetItemWithoutLink.propTypes = {
  action: PropTypes.string,
  item: PropTypes.shape({
    castName: PropTypes.string,
    castTitle: PropTypes.string,
    displayText: PropTypes.string,
    subTitle: PropTypes.string,
    title: PropTypes.string
  }),
  itemImageUrl: PropTypes.string,
  itemContainerClass: PropTypes.string,
  itemInnerContentClass: PropTypes.string,
  itemInnerContentTextClass: PropTypes.string,
  itemStyle: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  }),
  navigateFromPlayer: PropTypes.func,
  premium: PropTypes.bool,
  showProgressBar: PropTypes.bool,
  templates: PropTypes.object
};

export default AssetItemWithoutLink;
