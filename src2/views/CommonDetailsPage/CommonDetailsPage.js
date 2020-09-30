import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isBoolean from 'lodash/isBoolean';

import {
  isAssetHelper,
  loadDetailsPageData,
  purchaseHandler,
  railsDataHandler,
  sortEpisodesHelper
} from './loadDetailsPageDataHelper';
import { useBingeWatchHelper, useResumeWatchHelper } from './vodWatchHelper';
import {
  showParentalCheckHelper,
  useParentalCheck,
  useR21Check,
  usePinTimeout
} from './usePinHook';
import { useStreamUrlForDetails } from '#/views/EpgPage/timeshiftHelper';
import { getCurrentLinearProgram } from '#/views/EpgPage/getCurrentLinearProgramHelper';
import { usePlayerRecommendations } from '#/services/ovp/implementations/nagra';
import { useEntitlement } from '#/services/auth';
import {
  useParentalSettingsDetailsPage,
  useRestrictedChannels
} from '#/services/settings';
import { AuthContext, PageContext, PlayerContext } from '#/utils/context';
import { useFavourites, usePureState } from '#/utils/hooks';
import NagraPlayerShell from '#/containers/Player/NagraPlayerShell';
import TermsAndConditionsContainer from '#/containers/TermsAndConditions/TermsAndConditionsContainer';
import PinInputModal from '#/containers/PinInputModal/PinInputModal';

import {
  MetadataInfo,
  PackButtonControls,
  RailsSection,
  VideoButtonControls
} from '#/components/DetailsPageComponent';
import Modal from '#/components/Modal/Modal';
import OverlayComponent from '#/components/Overlay/OverlayComponent';
import Spinner from '#/components/Spinner/Spinner';
import { SEO, useSEO } from '#/components/SEO';

import { purchaseModalProps } from '#/views/AssetListing/utils/constants';
import { PAYMENT_CODES, R21, ROUTE, PLAYER_ACTION } from '#/constants';
import { getEntitlement, getExitPageHandler, numOfKeys } from '#/helpers';
import { useDestructureFromAuthContext } from '#/helpers/hooks';
import { getPlatform, isMobile, PLATFORM } from '#/utils/getPlatform';

import styles from './commonDetailsPage.scss';
import noPreviewPoster from '#/static/images/noPreviewPoster.svg';

import SocialSharingOverlay from '#/components/SocialSharing/SocialSharingOverlay';
import { localBookmarksCache } from '#/services/player';

const { MOVIE_DETAILS, PACK_DETAILS, SERIES_DETAILS, LINEAR_DETAILS } = ROUTE;
const { paymentOk } = PAYMENT_CODES;

const initialErrorState = {
  errorModalProps: {},
  showErrorModal: false
};

const OK_I_GOT_IT = 'okIGotIt';
const ERROR_TEXT = 'errorText';

const isCompatiblePlatform = !isMobile() && getPlatform() !== PLATFORM.other;

const { nextEpisode, prevEpisode } = PLAYER_ACTION;

const CommonDetailsPage = ({
  history,
  location,
  match,
  messages = {},
  theme
}) => {
  const [prevActionType, setActionType] = useState(false);
  const { isLoggedIn, nagraToken } = useDestructureFromAuthContext(AuthContext);
  const { path: pageType, params: { id } = {} } = match || {};
  const isAsset = isAssetHelper(pageType);
  const isMovieDetails = [MOVIE_DETAILS, SERIES_DETAILS].includes(pageType);
  const isPackDetails = pageType === PACK_DETAILS;
  const isLinearDetails = pageType === LINEAR_DETAILS;
  const assetIdRef = useRef(null);
  const streamUrlRef = useRef(null);
  const isStartOverRef = useRef(null);

  const [performRestrictedChannelsQuery, { data }] = useRestrictedChannels({
    isLazy: true
  });

  const { parentalPin: { restrictedChannels = [] } = {} } = data || {};

  const exitPage = getExitPageHandler(history);

  const {
    state: { errorModalProps, showErrorModal } = {},
    setState
  } = usePureState(initialErrorState);
  const [
    fetchParentalSettings,
    { data: parentalSettingsData }
  ] = useParentalSettingsDetailsPage();

  const {
    parentalPin: {
      isEnabled,
      settings: { restrictInAppPurchasesByPin } = {}
    } = {}
  } = parentalSettingsData || {};

  const toggleErrorModal = () => setState({ showErrorModal: !showErrorModal });
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [isPlayerReplayed, setPlayerReplayed] = useState(false);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(null);
  const [isPlayback, setIsPlayback] = useState(false);
  const [isShareDialogOpen, setShareDialogState] = useState(false);
  const { playerInstanceFromContext } = useContext(PlayerContext);
  const { setPageTitle } = useContext(PageContext);

  const {
    hasParentalPinCheck,
    isParentalPinValid,
    setIsParentalPinValid,
    setParentalPinCheck
  } = useParentalCheck();

  const { entitlements, fetchEntitlement } = useEntitlement({
    nagraToken,
    refetch: true
  });
  const { okIGotIt, termsAndConditionDescriptionText } = messages;

  const launchPlayer = async videoState => {
    setPlayerVisibility(videoState);

    if (videoState) {
      try {
        await playerInstanceFromContext?.play();
      } catch (e) {
        playerInstanceFromContext?.muted(true);
        await playerInstanceFromContext?.play();

        playerInstanceFromContext.volume(0);
      }

      return;
    }

    setPlayerReplayed(true);
  };

  const { pathname, state: historyState } = location;
  const contentIdArray = pathname.split('/');
  const contentId = contentIdArray[contentIdArray.length - 1];
  const [assetDetailsQuery, data2] =
    loadDetailsPageData({ pageType: match.path, contentId }) || [];

  const {
    details: detailsPageData,
    fetchLastPlayedEpisode,
    lastPlayedEpisodeData,
    error
  } = data2 || {};

  const [{ code, message } = {}] = error?.graphQLErrors || [];

  const {
    __typename,
    channel: { tvChannel, id: channelId } = {},
    duration,
    endTime,
    series,
    episodes = series?.episodes || [],
    episodeNumberAndTitle: displayTitle,
    episodeNumber,
    image,
    isCatchUpSupported,
    lastPlayedEpisode: lastPlayedEpisodeWithoutSeason,
    lastPlayedSeason,
    nowPlaying = {},
    position,
    products = [],
    productRefs = [],
    rating,
    seasons = series?.seasons || [],
    startOverSupport,
    startTime,
    tAndCText,
    title
  } = detailsPageData || {};
  const { id: programId } = nowPlaying || {};

  const { id: seasonAssetId } = series || {};

  const [toggleFavourites, { toggleFavLoading, isFavourite }] = useFavourites({
    isLinearDetails,
    id: seasonAssetId || id,
    channelId: channelId || id,
    programId: channelId ? id : programId
  });

  // get playable content from seasons or episodes
  const [firstSeasonEpisode] = seasons || [];
  const { episodes: seasonEpisodeContents } = firstSeasonEpisode || {};
  const sortedSeasonEpisodes = sortEpisodesHelper(seasonEpisodeContents);
  const [firstSeasonEpisodeContent] = sortedSeasonEpisodes || [];
  const { id: firstSeasonEpisodeContentId } = firstSeasonEpisodeContent || {};

  const sortedEpisodes = sortEpisodesHelper(episodes);
  const [firstEpisode] = sortedEpisodes || [];
  const { id: firstEpisodeContentId } = firstEpisode || {};

  const lastPlayedId = useResumeWatchHelper({
    episodes,
    lastPlayedEpisodeWithoutSeason,
    lastPlayedSeason,
    seasons
  });

  const isParentalPinEnabled = isEnabled && restrictInAppPurchasesByPin;

  const {
    modalProps,
    showModal,
    setShowModal,
    toggleModal,
    assetRating,
    ...purchaseButtonInfo
  } = purchaseHandler({
    contentId:
      firstSeasonEpisodeContentId || firstEpisodeContentId || contentId,
    history,
    isParentalPinEnabled,
    isParentalPinValid,
    messages,
    products,
    setParentalPinCheck
  });

  const { lastPlayedEpisode: lastPlayedEpisodeWithSeason } =
    lastPlayedSeason || {};

  const editorialId = series?.episodes?.length
    ? contentId
    : lastPlayedId ||
      firstSeasonEpisodeContentId ||
      firstEpisodeContentId ||
      contentId;

  const episodeIndex =
    episodeNumber ||
    lastPlayedEpisodeWithoutSeason?.episodeNumber ||
    lastPlayedEpisodeWithSeason?.episodeNumber;

  const {
    dispatchPlayerAction: triggerPlayerAction,
    currentEpisodeId,
    currentEpisodeNumberAndTitle,
    hasBingeWatch,
    showBingeParentalCheck,
    playerState
  } = useBingeWatchHelper({
    editorialId,
    episodeIndex: episodeIndex - 1,
    episodes: sortedEpisodes,
    parentalSettingsData
  });

  const lastPlayedEpisode =
    (currentEpisodeId && lastPlayedEpisodeData) || lastPlayedEpisodeWithSeason;

  const { rating: episodeWithoutSeasonRating } =
    lastPlayedEpisodeWithoutSeason || {};

  const { rating: episodeWithSeasonRating } = lastPlayedEpisode || {};

  const episodeRating = episodeWithSeasonRating || episodeWithoutSeasonRating;

  const showParentalCheck = showParentalCheckHelper({
    id,
    isLinearDetails,
    parentalSettingsData,
    rating: episodeRating || assetRating || rating,
    restrictedChannels,
    tvChannel
  });

  const { episodeNumberAndTitle: lastPlayedEpisodeNumberAndTitleWithSeason } =
    lastPlayedEpisode || {};
  const {
    episodeNumberAndTitle: lastPlayedEpisodeNumberAndTitleWithoutSeason
  } = lastPlayedEpisodeWithoutSeason || {};
  const lastPlayedEpisodeNumberAndTitle =
    lastPlayedEpisodeNumberAndTitleWithSeason ||
    lastPlayedEpisodeNumberAndTitleWithoutSeason;

  const { episodeNumberAndTitle: firstEpisodeNumberAndTitle } =
    firstSeasonEpisodeContent || firstEpisode || {};

  const defaultEpisodeNumberAndTitle =
    __typename === 'Editorial'
      ? displayTitle
      : lastPlayedEpisodeNumberAndTitle ||
        displayTitle ||
        firstEpisodeNumberAndTitle;

  const linearContentId = programId || contentId;

  const recommendationId = isLinearDetails ? linearContentId : editorialId;

  const [
    loadPlayerRecommendations,
    {
      data: {
        playerDetails: {
          page: { containersData: playerRecommendations } = {}
        } = {}
      } = {}
    }
  ] = usePlayerRecommendations(recommendationId);

  const { isBingeWatching, isNewEpisodePlayed } = playerState || {};
  const episodeNumberAndTitle = isBingeWatching
    ? currentEpisodeNumberAndTitle
    : defaultEpisodeNumberAndTitle;

  const { streamUrl, loadStreamUrl, streamUrlLoading } = useStreamUrlForDetails(
    {
      isMovieDetails,
      startOverSupport,
      startTime,
      endTime,
      isCatchUpSupported
    }
  );

  const dispatchPlayerAction = (...actionArgs) => {
    const [{ type } = {}] = actionArgs || [];

    if ([prevEpisode, nextEpisode].includes(type) && !isLinearDetails) {
      setActionType(type);
    }

    triggerPlayerAction(...actionArgs);
  };

  useEffect(() => {
    if (recommendationId) {
      loadPlayerRecommendations();
    }
  }, [recommendationId]);

  useEffect(() => {
    if (isNewEpisodePlayed) {
      fetchLastPlayedEpisode({ variables: { id: currentEpisodeId } });
    }
  }, [streamUrlLoading, isNewEpisodePlayed]);

  const detailsPageRails = railsDataHandler({ detailsPageData });
  const isEntitled = getEntitlement({ entitlements, productRefs });
  const isR21 = rating === R21;

  const { purchaseButtonCta, purchaseData } = purchaseButtonInfo;
  const {
    loading: purchaseLoading,
    data: { purchase: { code: purchaseCode } = {} } = {},
    error: purchaseError
  } = purchaseData;
  const isSuccess = purchaseCode === paymentOk && !purchaseError;

  const { hasR21PinCheck, setIsR21PinValid, setR21PinCheck } = useR21Check();

  const assetId = useMemo(() => {
    if (isLoggedIn && isEntitled && isAsset) {
      if (isNewEpisodePlayed) {
        return currentEpisodeId;
      }
      const hasLastPlayedChapter =
        numOfKeys(lastPlayedSeason) ||
        numOfKeys(lastPlayedEpisodeWithoutSeason);
      if (hasLastPlayedChapter) {
        return lastPlayedId;
      }

      return series?.episodes?.length
        ? contentId
        : firstSeasonEpisodeContentId || firstEpisodeContentId || contentId;
    }

    return null;
  }, [
    contentId,
    editorialId,
    isEntitled,
    isLoggedIn,
    lastPlayedId,
    currentEpisodeId,
    isNewEpisodePlayed
  ]);

  useEffect(() => {
    if (!playerInstanceFromContext) {
      return;
    }
    const { currentEpisodeIndex } = playerState || {};

    const currentId = sortedEpisodes[currentEpisodeIndex]?.id;

    if (currentId) {
      playerInstanceFromContext.setState?.({
        routeChange: MOVIE_DETAILS.replace(':id', currentId)
      });
    }
  }, [playerState]);

  const [hasAssetChanged, setHasAssetChanged] = useState(false);

  useEffect(() => {
    if (
      [prevEpisode, nextEpisode].includes(prevActionType) &&
      hasAssetChanged &&
      !streamUrlLoading
    ) {
      loadStreamUrl(currentEpisodeId);
    }
  }, [prevActionType, hasAssetChanged]);

  const launchAndPlayVideo = (videoState, { isPinValid } = {}) => {
    if (videoState) {
      const { state } = playerInstanceFromContext || {};

      playerInstanceFromContext?.setState({
        ...state,
        isStartOver: isStartOverRef.current
      });
    }

    if (videoState && !isPinValid) {
      if (isR21) {
        setR21PinCheck(true);
        setIsPlayback(true);

        return;
      }
      if (showParentalCheck) {
        setParentalPinCheck(true);
        setIsPlayback(true);

        return;
      }
    }

    setIsPlayback(true);
    launchPlayer(videoState);
  };

  const playVideo =
    streamUrl?.uri && !streamUrlLoading && !hasAssetChanged
      ? launchAndPlayVideo
      : () => !streamUrlLoading && loadStreamUrl(assetId);

  const playVideoBtnClick = (...args) => {
    if (prevActionType) {
      setActionType(null);
    }

    playVideo(...args);
  };

  const onStartOverClick = () => {
    isStartOverRef.current = true;

    playVideoBtnClick(true, { showParentalCheck });
  };

  const resetStartOverState = () => {
    isStartOverRef.current = false;
  };

  const {
    clearPinTimeout: clearR21Timeout,
    setTimeoutPinCheck: setTimeoutR21PinCheck
  } = usePinTimeout({
    isPinRequired: isR21,
    playerInstanceFromContext,
    setIsPinValid: setIsR21PinValid,
    setPinCheck: setR21PinCheck
  });

  const {
    clearPinTimeout: clearParentalPinTimeout,
    setTimeoutPinCheck: setTimeoutParentalPinCheck
  } = usePinTimeout({
    isPinRequired: showParentalCheck,
    playerInstanceFromContext,
    setIsPinValid: setIsParentalPinValid,
    setPinCheck: setParentalPinCheck
  });

  const { isPurchaseSuccess, purchasedContent } = historyState || {};
  const purchaseRedirectionModalProps = purchaseModalProps({
    isSuccess: isPurchaseSuccess,
    messages,
    purchasedContent
  });

  const combinedModalProps = modalProps || purchaseRedirectionModalProps;

  useEffect(() => {
    assetDetailsQuery();

    if (historyState && _isBoolean(isPurchaseSuccess)) {
      setShowModal(true);
    }

    return () => {
      clearR21Timeout();
      clearParentalPinTimeout();
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (isLinearDetails) {
        performRestrictedChannelsQuery();
      }
      fetchEntitlement();
      fetchParentalSettings();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setPageTitle(title);
  }, [title]);

  useEffect(() => {
    if (!code || !message) {
      return;
    }

    setState({
      errorModalProps: {
        buttonProps: [{ displayText: OK_I_GOT_IT, onClick: exitPage }],
        title: ERROR_TEXT,
        subtitleText: message,
        iconType: 'warning',
        onModalClose: exitPage
      },
      showErrorModal: !showErrorModal
    });
  }, [code, message]);

  const { id: nowPlayingId, next: nextProgram } = nowPlaying || {};
  const { duration: nextDuration, rating: nextRating } = nextProgram || {};
  const programSelectedInfo = {
    duration,
    id: nowPlayingId,
    isCatchUpSupported,
    endTime,
    next: {
      duration: nextDuration,
      showParentalCheck: showParentalCheckHelper({
        parentalSettingsData,
        rating: nextRating
      })
    },
    showParentalCheck: showParentalCheckHelper({
      parentalSettingsData,
      rating
    }),
    startOverSupport,
    startTime
  };

  const loadCurrentLinearDetails = getCurrentLinearProgram({
    messages,
    parentalSettingsData,
    playerInstanceFromContext
  });

  useEffect(() => {
    const { uri } = streamUrl || {};
    setHasAssetChanged(assetIdRef.current && assetIdRef.current !== assetId);
    if (uri !== streamUrlRef.current && playerInstanceFromContext) {
      assetIdRef.current = assetId;
      streamUrlRef.current = uri;

      if (!prevActionType) {
        playVideo(true, { showParentalCheck });
      }
    }
  }, [streamUrl, playerInstanceFromContext, assetId]);

  // for case when asset not reloaded but position was changed already and saved even in server
  const memoryPosition = localBookmarksCache[assetId];
  useEffect(() => {
    setPlayerCurrentTime(memoryPosition || position);
  }, [position, memoryPosition]);

  const imageUrlWithSpaceEncoding = image?.replace(' ', '%20');
  const detailsStyle = {
    backgroundImage: `url(${imageUrlWithSpaceEncoding})`
  };

  const {
    detailsPageSpinner,
    metadataSectionContainer,
    moviePosterContainer,
    noPreviewPosterBackground,
    playerContainer,
    railsContainer,
    termsAndConditionsText,
    termsAndConditionsContainer,
    visible,
    socialSharingOverlayDimension
  } = theme;

  const playerContainerClass = classNames(playerContainer, {
    [visible]: playerVisibility
  });

  const isPinInputVisible = hasR21PinCheck || hasParentalPinCheck;
  const isR21PinInput = hasR21PinCheck && !hasParentalPinCheck;

  const pinInputProps = isR21PinInput
    ? {
        hasPinCheck: hasR21PinCheck,
        pinValidAction: playVideo,
        setIsPinValid: setIsR21PinValid,
        setPinCheck: setR21PinCheck,
        type: 'r21',
        isPlayback
      }
    : {
        hasPinCheck: hasParentalPinCheck,
        pinValidAction: isPlayback ? playVideo : purchaseButtonCta,
        setIsPinValid: setIsParentalPinValid,
        setPinCheck: setParentalPinCheck,
        type: 'parental',
        isPlayback
      };

  const streamAndPlayerLoaded =
    !streamUrlLoading && (!streamUrl || numOfKeys(playerInstanceFromContext));
  /**
   * Conditions to show button and hide spinner
   * When video is loaded -> play button is shown
   * When user is logged out -> login button is shown
   * When user is not entitled and not during purchase process -> rent / buy button is shown
   */
  const hasLoaded =
    isAsset &&
    (streamAndPlayerLoaded ||
      !isLoggedIn ||
      (!isEntitled && isLoggedIn && !purchaseLoading && !isSuccess) ||
      !isCompatiblePlatform);

  const PosterBackground = () => {
    if (!image) {
      return (
        <div className={noPreviewPosterBackground}>
          <img src={noPreviewPoster} alt="No preview poster available" />
          <span>No preview available</span>
        </div>
      );
    }

    return <div className={moviePosterContainer} style={detailsStyle} />;
  };

  const seoMetadata = useSEO({
    id,
    imageUrl: imageUrlWithSpaceEncoding,
    ...detailsPageData
  });

  const favouriteBtnControls = {
    isLinearDetails,
    onClick: toggleFavourites,
    loading: toggleFavLoading,
    isFavourite
  };

  const detailsPageInfo = {
    ...detailsPageData,
    ...(lastPlayedEpisodeData &&
      (currentEpisodeId && __typename === 'SeriesNode') && {
        currentEpisode: lastPlayedEpisode
      })
  };

  return (
    <div>
      {detailsPageData && (
        <div>
          <div className={metadataSectionContainer}>
            <SEO seoMetadata={seoMetadata} />
            {Object.keys(detailsPageData).length ? <PosterBackground /> : ''}
            <MetadataInfo
              firstEpisodeNumberAndTitle={firstEpisodeNumberAndTitle}
              isAsset={isAsset}
              lastPlayedEpisodeNumberAndTitle={lastPlayedEpisodeNumberAndTitle}
              messages={messages}
              pageType={pageType}
              productId={id}
              assetRating={episodeRating || assetRating}
              {...detailsPageData}
            />
            {hasLoaded && !toggleFavLoading ? (
              <VideoButtonControls
                toggleWatchlist={toggleFavourites}
                isFavourite={isFavourite}
                detailsPageData={detailsPageInfo}
                history={history}
                isCompatiblePlatform={isCompatiblePlatform}
                isEntitled={isEntitled}
                isLoggedIn={isLoggedIn}
                messages={messages}
                pageType={pageType}
                playerCurrentTime={playerCurrentTime}
                purchaseButtonInfo={purchaseButtonInfo}
                showParentalCheck={showParentalCheck}
                isShareDialogOpen={isShareDialogOpen}
                setShareDialogState={setShareDialogState}
                playVideo={playVideoBtnClick}
                onStartOverClick={onStartOverClick}
              />
            ) : (
              (isAsset || toggleFavLoading) && (
                <Spinner className={detailsPageSpinner} />
              )
            )}

            {isPackDetails && ((isLoggedIn && entitlements) || !isLoggedIn) && (
              <PackButtonControls
                detailsPageData={detailsPageData}
                history={history}
                isEntitled={isEntitled}
                isLoggedIn={isLoggedIn}
                messages={messages}
                purchaseButtonInfo={purchaseButtonInfo}
              />
            )}
          </div>

          {isAsset && (
            <Fragment>
              <div className={playerContainerClass}>
                <NagraPlayerShell
                  dispatchPlayerAction={dispatchPlayerAction}
                  editorialId={editorialId}
                  currentEpisodeId={currentEpisodeId}
                  episodeNumberAndTitle={episodeNumberAndTitle}
                  hasBingeWatch={hasBingeWatch}
                  history={history}
                  isMovieDetails={isMovieDetails}
                  isPlayerReplayed={isPlayerReplayed}
                  isR21={isR21}
                  loadCurrentLinearDetails={loadCurrentLinearDetails}
                  parentalSettingsData={parentalSettingsData}
                  playerState={playerState}
                  playerWatchedPosition={playerCurrentTime}
                  playVideo={playVideoBtnClick}
                  playerVisibility={playerVisibility}
                  programSelectedInfo={programSelectedInfo}
                  recommendations={playerRecommendations}
                  setPlayerCurrentTime={setPlayerCurrentTime}
                  setPlayerReplayed={setPlayerReplayed}
                  setPlayerVisibility={setPlayerVisibility}
                  showBingeParentalCheck={showBingeParentalCheck}
                  favouriteBtnControls={favouriteBtnControls}
                  resetStartOverState={resetStartOverState}
                  streamUrl={streamUrl}
                  title={series?.title || title}
                  setTimeoutR21PinCheck={setTimeoutR21PinCheck}
                  setTimeoutParentalPinCheck={setTimeoutParentalPinCheck}
                />
              </div>
              <RailsSection
                railsArray={detailsPageRails}
                railsContainerClass={railsContainer}
              />
            </Fragment>
          )}
          {isPackDetails && tAndCText && (
            <div className={termsAndConditionsContainer}>
              <TermsAndConditionsContainer
                acknowledgeText={okIGotIt}
                declarationText={termsAndConditionDescriptionText}
                tAndCText={tAndCText}
                textStyle={termsAndConditionsText}
              />
            </div>
          )}
          <Modal
            showModal={combinedModalProps && showModal}
            toggleModal={toggleModal}
            {...combinedModalProps}
          />
          {isPinInputVisible && (
            <PinInputModal
              {...pinInputProps}
              playerInstanceFromContext={playerInstanceFromContext}
            />
          )}
        </div>
      )}
      <Modal
        showModal={!detailsPageData && error && showErrorModal}
        toggleModal={toggleErrorModal}
        {...errorModalProps}
      />
      <OverlayComponent
        isOverlayOpen={isShareDialogOpen}
        customDimension={socialSharingOverlayDimension}
        toggleOverlayState={() => setShareDialogState(!isShareDialogOpen)}
      >
        {isShareDialogOpen && <SocialSharingOverlay messages={messages} />}
      </OverlayComponent>
    </div>
  );
};

CommonDetailsPage.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  messages: PropTypes.object,
  theme: PropTypes.object
};

CommonDetailsPage.defaultProps = {
  theme: styles
};

export default CommonDetailsPage;
