import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

import PageTitle from '#/components/PageTitle/PageTitle';
import { QualityIcon } from '#/components/Icons';
import { AuthContext } from '#/utils/context';
import { ROUTE, PRODUCT_TYPE } from '#/constants';
import {
  unixMsToLocalTimeWithDateOnly,
  unixMsToLocalTimeWithTimeOnly
} from '#/helpers/timeHelpers';

import {
  assetDetailsTitle,
  metadataContainer,
  movieMetadata,
  metadataDescription,
  packMetadataContainer,
  qualityIcon,
  ratingIcon,
  entitlementInfo
} from './metadataInfo.scss';

const { LINEAR_DETAILS } = ROUTE;

const FORMAT = 'DD MMM YYYY LT';
const PREFIX_KEY = 'detailTitleExpire';
const DEFAULT_PREFIX = 'will expire on';

const getEntitledString = ({
  entitlements = {},
  productId,
  prefix = DEFAULT_PREFIX
} = {}) => {
  const { expiryDate, productType: product } = entitlements?.[productId] || {};

  const productType = (product || '').toLowerCase();

  if (productType !== PRODUCT_TYPE.TVOD) {
    return '';
  }

  const expiryTime = parseInt(expiryDate, 10);

  return expiryTime
    ? `${prefix} ${moment.unix(expiryTime / 1000).format(FORMAT)} SGT`
    : '';
};

const MetadataInfo = ({
  __typename,
  assetRating,
  description,
  duration,
  endTime,
  episodeNumberAndTitle = '',
  firstEpisodeNumberAndTitle = '',
  genres = [],
  hdContent,
  isAsset,
  lastPlayedEpisode: lastPlayedEpisodeWithoutSeason = {},
  lastPlayedEpisodeNumberAndTitle = '',
  lastPlayedSeason = {},
  messages = {},
  nowPlaying = {},
  packMetadata,
  pageType,
  productId,
  rating,
  series,
  subTitle: packSubtitle = '',
  subtitles = [],
  startTime,
  title
}) => {
  const { hd, sd } = messages;
  const {
    state: { isLoggedIn, entitlements }
  } = useContext(AuthContext);

  const entitledString = getEntitledString({
    entitlements,
    productId,
    prefix: messages[PREFIX_KEY] || ''
  });

  const { lastPlayedEpisode } = lastPlayedSeason || {};
  const {
    description: lastPlayedWithSeasonDescription,
    duration: lastPlayedWithSeasonDuration
  } = lastPlayedEpisode || {};
  const {
    description: lastPlayedWithoutSeasonDescription,
    duration: lastPlayedWithoutSeasonDuration
  } = lastPlayedEpisodeWithoutSeason || {};
  const displayedDescription =
    lastPlayedWithSeasonDescription ||
    lastPlayedWithoutSeasonDescription ||
    description;

  const displayedDuration =
    lastPlayedWithSeasonDuration || lastPlayedWithoutSeasonDuration || duration;

  const { language } = nowPlaying || {};
  const durationDisplay =
    pageType === LINEAR_DETAILS
      ? `${unixMsToLocalTimeWithTimeOnly(
          startTime
        )} - ${unixMsToLocalTimeWithTimeOnly(
          endTime
        )} | ${unixMsToLocalTimeWithDateOnly(startTime)}`
      : `Duration: ${Math.round(displayedDuration / 60)} mins`;
  const languageDisplay = subtitles?.length
    ? `Subtitles: ${subtitles.join(', ') || language}`
    : '';
  const qualityIconTextDisplay = hdContent ? hd : sd;

  const ratingValue = assetRating || rating;

  return (
    <div className={metadataContainer}>
      <PageTitle
        className={assetDetailsTitle}
        text={series?.title || title}
        subtitle={
          __typename === 'Editorial'
            ? episodeNumberAndTitle
            : lastPlayedEpisodeNumberAndTitle ||
              episodeNumberAndTitle ||
              firstEpisodeNumberAndTitle
        }
      />
      {isAsset && (
        <div className={movieMetadata}>
          <div>
            {qualityIconTextDisplay && (
              <QualityIcon
                iconStyle={qualityIcon}
                iconText={qualityIconTextDisplay}
              />
            )}
            {ratingValue && <div className={ratingIcon}>{ratingValue}</div>}
            <span>{genres?.join(', ')}</span>
          </div>
          <div>{(startTime || duration) && <span>{durationDisplay}</span>}</div>
          {languageDisplay && (
            <div>
              <span>{languageDisplay}</span>
            </div>
          )}
        </div>
      )}
      {isLoggedIn && entitledString && (
        <span className={entitlementInfo}>{entitledString}</span>
      )}
      {!isAsset && (
        <div className={packMetadataContainer}>
          <span>{packSubtitle}</span>
          <span>{packMetadata}</span>
        </div>
      )}
      <div className={metadataDescription}>{displayedDescription}</div>
    </div>
  );
};

MetadataInfo.propTypes = {
  __typename: PropTypes.string,
  assetRating: PropTypes.string,
  description: PropTypes.string,
  duration: PropTypes.number,
  endTime: PropTypes.number,
  episodeNumberAndTitle: PropTypes.string,
  firstEpisodeNumberAndTitle: PropTypes.string,
  genres: PropTypes.arrayOf(PropTypes.string),
  hdContent: PropTypes.bool,
  isAsset: PropTypes.bool,
  lastPlayedEpisode: PropTypes.object,
  lastPlayedEpisodeNumberAndTitle: PropTypes.string,
  lastPlayedSeason: PropTypes.object,
  messages: PropTypes.object,
  nowPlaying: PropTypes.shape({
    language: PropTypes.string
  }),
  productId: PropTypes.string,
  packMetadata: PropTypes.string,
  pageType: PropTypes.string,
  rating: PropTypes.string,
  series: PropTypes.object,
  startTime: PropTypes.number,
  subTitle: PropTypes.string,
  subtitles: PropTypes.array,
  title: PropTypes.string
};

export default MetadataInfo;
