import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ConfigContext } from '#/utils/context';
import Button from '#/components/Button/Button';

import {
  FavouriteFilledIcon,
  FavouriteIcon,
  PlayIcon,
  StartOverIcon
} from '#/components/Icons';
import { noop } from '#/helpers';
import { ROUTE } from '#/constants';

import {
  autoButtonSpanStyle,
  blackIconStyle,
  focused,
  nonHoverableButton,
  notSupportedText,
  rightMarginIconStyle,
  sizingIconStyle,
  videoButtonControlsContainer,
  whiteIconStyle,
  noPurchaseStyle
} from './videoButtonControls.scss';

import SocialSharingButtonControls from './SocialSharingButtonControls';
import { useRedirectToLogin } from '#/services/purchase';

const { LINEAR_DETAILS } = ROUTE;

const FavouriteOrWatchlistButton = ({
  displayText,
  inFavorites,
  onClickFn = noop
}) => {
  const favouriteOrWatchlistButtonClass = classNames({
    [focused]: inFavorites
  });
  const icon = inFavorites ? FavouriteFilledIcon : FavouriteIcon;
  const customIconStyle = {
    iconStyle: inFavorites ? sizingIconStyle : whiteIconStyle
  };

  return (
    <Button
      dark
      hasLeftIcon
      className={favouriteOrWatchlistButtonClass}
      customIconStyle={customIconStyle}
      displayText={displayText}
      Icon={icon}
      onClick={onClickFn}
    />
  );
};

const VideoButtonControls = ({
  detailsPageData,
  isFavourite,
  isCompatiblePlatform,
  isEntitled,
  messages = {},
  pageType,
  playerCurrentTime = 0,
  playVideo,
  purchaseButtonInfo = {},
  showParentalCheck,
  toggleWatchlist = noop,
  isShareDialogOpen = false,
  setShareDialogState = noop,
  onStartOverClick = noop
}) => {
  const {
    channel: { catchUpSupport } = {},
    currentEpisode,
    isIptvMulticast,
    isOttUnicast,
    lastPlayedEpisode = {},
    lastPlayedSeason = {},
    startTime,
    seasonNumber,
    episodeNumber
  } = detailsPageData || {};
  const {
    browserDeviceNotSupported,
    detailEpisodeNumRegex,
    detailLoginToWatch,
    detailResume,
    detailResumeEpisode,
    detailResumeSeason,
    detailSeasonNumRegex,
    detailStartOver,
    detailWatchNowButtonTitle,
    vodPlayButtonTitle
  } = messages;
  const {
    episodeNumber: lastPlayedEpisodeNumber = '',
    seasonNumber: lastPlayedSeasonNumber = ''
  } = lastPlayedSeason?.lastPlayedEpisode || {};
  const { episodeNumber: lastEpisodeNumberFromLastPlayedEpisode = '' } =
    lastPlayedEpisode || {};

  const {
    episodeNumber: currentEpisodeNumber = episodeNumber,
    seasonNumber: currentSeasonNumber = seasonNumber
  } = currentEpisode || {};

  const lastEpisodeNumber = currentEpisodeNumber || lastPlayedEpisodeNumber;
  const lastSeasonNumber = currentSeasonNumber || lastPlayedSeasonNumber;

  const lastEpisodeNumberWithoutSeason =
    currentEpisodeNumber || lastEpisodeNumberFromLastPlayedEpisode;

  const { purchaseButtonText, purchaseButtonCta } = purchaseButtonInfo;
  const { noPurchaseButtonText } = useContext(ConfigContext);

  const playVideoButtonControl = () => playVideo(true, { showParentalCheck });

  const isLinearDetails = pageType === LINEAR_DETAILS;

  const detailResumeSeasonOrEpisode = lastSeasonNumber
    ? detailResumeSeason
        .replace(detailSeasonNumRegex, lastSeasonNumber)
        .replace(detailEpisodeNumRegex, lastEpisodeNumber)
    : detailResumeEpisode.replace(
        detailEpisodeNumRegex,
        lastEpisodeNumberWithoutSeason
      );
  const detailResumeText =
    lastEpisodeNumber || lastSeasonNumber
      ? detailResumeSeasonOrEpisode
      : detailResume;
  const playStatusText = playerCurrentTime
    ? detailResumeText
    : vodPlayButtonTitle;
  const playButtonText = isLinearDetails
    ? detailWatchNowButtonTitle
    : playStatusText;
  const playOrPurchaseText = isEntitled ? playButtonText : purchaseButtonText;

  // kept as Formula for future reference
  // const watchProgress = isLinearDetails
  //   ? ((Date.now() - startTime) / (endTime - startTime)) * 100
  //   : (playerCurrentTime / duration) * 100;

  const favBtnAction = isFavourite ? 'RemoveFrom' : 'AddTo';
  const favBtnSuffix = isLinearDetails ? 'Fav' : 'WatchList';

  const favouriteOrWatchlistText =
    messages?.[`detail${favBtnAction}${favBtnSuffix}`];
  const isFibreTv = isIptvMulticast && !isOttUnicast;
  const isPlayableOrPurchasable =
    (isEntitled && isCompatiblePlatform && !isFibreTv) || !isEntitled;

  const { redirectToLogin, isLoggedIn } = useRedirectToLogin();

  if (!isLoggedIn) {
    return (
      <div className={videoButtonControlsContainer}>
        <Button
          light
          displayText={detailLoginToWatch}
          onClick={redirectToLogin}
        />
        <SocialSharingButtonControls
          isShareDialogOpen={isShareDialogOpen}
          setShareDialogState={setShareDialogState}
        />
      </div>
    );
  }
  const isFutureProgram = isLinearDetails ? Date.now() <= startTime : false;
  const isNotPurchasable = !isEntitled && !purchaseButtonText;

  return (
    <div className={videoButtonControlsContainer}>
      <div>
        {playOrPurchaseText && isPlayableOrPurchasable && !isFutureProgram && (
          <Button
            light
            disabled={isEntitled && !playVideo}
            onClick={isEntitled ? playVideoButtonControl : purchaseButtonCta}
          >
            {isEntitled && (
              <PlayIcon
                iconContainer={rightMarginIconStyle}
                iconStyle={blackIconStyle}
              />
            )}
            <span className={autoButtonSpanStyle}>{playOrPurchaseText}</span>
            {/* // In case progress-bar on button is re-added
            {!isDisabled && isEntitled (
              <ProgressBar
                isBlackProgressBar
                className={progressBar}
                progressPercent={watchProgress}
              />
            )} */}
          </Button>
        )}
        {isNotPurchasable && noPurchaseButtonText && (
          <div className={noPurchaseStyle}>{noPurchaseButtonText}</div>
        )}
        {isEntitled && !isCompatiblePlatform && (
          <span className={notSupportedText}>{browserDeviceNotSupported}</span>
        )}
      </div>
      {isLinearDetails && catchUpSupport && !isFutureProgram && (
        <div>
          <Button
            dark
            hasLeftIcon
            className={nonHoverableButton}
            customIconStyle={{
              iconStyle: whiteIconStyle,
              svgIconStyle: sizingIconStyle
            }}
            displayText={detailStartOver}
            Icon={StartOverIcon}
            onClick={onStartOverClick}
          />
        </div>
      )}
      {isLoggedIn && (
        <div>
          <FavouriteOrWatchlistButton
            displayText={favouriteOrWatchlistText}
            inFavorites={isFavourite}
            onClickFn={toggleWatchlist}
          />
        </div>
      )}
      <SocialSharingButtonControls
        isShareDialogOpen={isShareDialogOpen}
        setShareDialogState={setShareDialogState}
      />
    </div>
  );
};

FavouriteOrWatchlistButton.propTypes = {
  displayText: PropTypes.string,
  inFavorites: PropTypes.bool,
  onClickFn: PropTypes.func
};

VideoButtonControls.propTypes = {
  detailsPageData: PropTypes.object,
  isCompatiblePlatform: PropTypes.bool,
  isEntitled: PropTypes.bool,
  isFavourite: PropTypes.bool,
  messages: PropTypes.object,
  onStartOverClick: PropTypes.func,
  pageType: PropTypes.string,
  playerCurrentTime: PropTypes.number,
  playVideo: PropTypes.func,
  purchaseButtonInfo: PropTypes.shape({
    purchaseButtonCta: PropTypes.func,
    purchaseButtonText: PropTypes.string
  }),
  showParentalCheck: PropTypes.bool,
  toggleWatchlist: PropTypes.func,
  isShareDialogOpen: PropTypes.bool,
  setShareDialogState: PropTypes.func
};

export default VideoButtonControls;
