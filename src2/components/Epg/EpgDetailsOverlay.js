import React, { Fragment, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { usePureState } from '#/utils/hooks';

import Button from '#/components/Button/Button';
import ProgressBar from '#/components/DetailsPageComponent/ProgressBar';
import { CrossIcon, PlayIcon } from '#/components/Icons';
import Spinner from '#/components/Spinner/Spinner';

import { getEntitlement, noop, numOfKeys } from '#/helpers';
import { ConfigContext } from '#/utils/context';
import { unixMsToLocalTimeWithTimeOnly } from '#/helpers/timeHelpers';
import { ROUTE } from '#/constants';
import { getPlatform, isMobile, PLATFORM } from '#/utils/getPlatform';

import {
  blackIconStyle,
  buttonsContainer,
  closeIcon,
  detailsOverlay,
  descriptionContainer,
  descriptionText,
  epgDetailsOverlaySpinner,
  noPurchaseText,
  genreText,
  innerContainer,
  notSupportedText,
  posterContainer,
  progressBar,
  ratingIcon,
  titleContainer,
  titleText
} from './epgDetailsOverlay.scss';

const { LINEAR_DETAILS, LOGIN, MULTI_PACKS, PACK_DETAILS } = ROUTE;

const playIconProps = {
  customIconStyle: { iconStyle: blackIconStyle },
  Icon: PlayIcon
};

const isCompatiblePlatform = !isMobile() && getPlatform() !== PLATFORM.other;

const getPlayButtonProps = ({
  isLoggedIn,
  history,
  isEntitled,
  playAction,
  streamUrlLoading,
  epgStreamUrl,
  playerInstanceFromContext,
  packRedirectionUrl,
  messages
}) => {
  const {
    detailLoginToWatch: loginToWatchBtnText,
    linearPlayButtonTitle: linearPlayBtnText,
    detailViewSubsPackBtn
  } = messages || {};

  const nonPlaybackAction = () =>
    history.push(isLoggedIn ? packRedirectionUrl : LOGIN);

  if (!isLoggedIn) {
    return [loginToWatchBtnText, nonPlaybackAction, isLoggedIn];
  }

  return [
    isEntitled ? linearPlayBtnText : detailViewSubsPackBtn,
    isEntitled ? playAction : nonPlaybackAction,
    isEntitled &&
      (streamUrlLoading || (epgStreamUrl && !playerInstanceFromContext))
  ];
};

const initialState = {
  prevProgramId: '',
  programChanged: false
};

const EpgDetailsOverlay = ({
  closeOverlay = noop,
  description,
  endTime,
  entitlements = {},
  epgDetailsLoading,
  genres = [],
  history = {},
  id: programId,
  isLoggedIn,
  image,
  messages = {},
  navigateAwayFromPage = noop,
  playerInstanceFromContext = {},
  playVideo = noop,
  productRefs = [],
  products = [],
  rating,
  showParentalCheck,
  startTime,
  title = '',
  epgStreamUrl,
  loadStreamUrl,
  streamUrlLoading,
  programId: currentProgramId
}) => {
  const {
    browserDeviceNotSupported,
    epgViewDetails_web: epgViewDetails
  } = messages;

  const { noPurchaseButtonText } = useContext(ConfigContext);

  const {
    state: { prevProgramId, programChanged } = {},
    setState
  } = usePureState(initialState);

  const streamUrlLoadingRef = useRef(false);

  const nonEmptyProducts = products?.reduce((accumulator, singlePack) => {
    const { pack } = singlePack || {};
    const purchasablePacks = (pack || []).filter(
      ({ purchasableUfinityProduct }) => numOfKeys(purchasableUfinityProduct)
    );

    return [...accumulator, ...purchasablePacks];
  }, []);

  const [singleProduct] = nonEmptyProducts.length === 1 ? nonEmptyProducts : [];
  const { id: singleProductId } = singleProduct || {};

  const singlePackUrl = PACK_DETAILS.replace(':id', singleProductId);
  const packRedirectionUrl =
    nonEmptyProducts.length > 1 ? `${MULTI_PACKS}/${programId}` : singlePackUrl;

  const isEntitled = getEntitlement({ entitlements, productRefs });

  const isAvailableToBuyOrPlay =
    (isLoggedIn && !isEntitled && nonEmptyProducts?.length) ||
    (isEntitled && isCompatiblePlatform) ||
    !isLoggedIn;
  const isFutureProgram = startTime > Date.now();

  const navigateToDetails = () => {
    const detailsPageRoute = LINEAR_DETAILS.replace(':id', programId);
    navigateAwayFromPage(detailsPageRoute);
  };

  const programProgress =
    ((Date.now() - startTime) / (endTime - startTime)) * 100;

  const canPlay = epgStreamUrl && playerInstanceFromContext && !programChanged;
  const play = () => {
    canPlay && playVideo(true, { showParentalCheck });
  };

  useEffect(() => {
    if (!currentProgramId) {
      return;
    }

    if (currentProgramId !== prevProgramId) {
      setState({
        programChanged: true,
        prevProgramId: currentProgramId
      });
    }
  }, [currentProgramId]);

  useEffect(() => {
    if (streamUrlLoadingRef.current && !streamUrlLoading) {
      setState({ programChanged: false });
    }

    streamUrlLoadingRef.current = streamUrlLoading;
  }, [streamUrlLoading]);

  useEffect(() => {
    play();
  }, [epgStreamUrl?.uri, playerInstanceFromContext, programChanged]);

  const [playButtonText, playButtonAction, isLoading] = getPlayButtonProps({
    isLoggedIn,
    history,
    isEntitled,
    playAction: canPlay ? play : loadStreamUrl,
    streamUrlLoading,
    epgStreamUrl,
    playerInstanceFromContext,
    packRedirectionUrl,
    messages
  });

  if (epgDetailsLoading) {
    return (
      <div className={detailsOverlay}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={detailsOverlay}>
      <div className={innerContainer}>
        <div className={posterContainer}>
          <img src={image} alt={`${title} poster`} />
          {startTime && endTime && (
            <Fragment>
              <span>{`${unixMsToLocalTimeWithTimeOnly(
                startTime
              )} - ${unixMsToLocalTimeWithTimeOnly(endTime)}`}</span>
              <ProgressBar
                isGreenProgressBar
                className={progressBar}
                progressPercent={programProgress}
              />
            </Fragment>
          )}
        </div>
        <div className={titleContainer}>
          <span className={titleText}>{title}</span>
          <div>
            {rating && <div className={ratingIcon}>{rating}</div>}
            <span className={genreText}>{genres.join(', ')}</span>
          </div>
          {!isAvailableToBuyOrPlay && (
            <div className={noPurchaseText}>{noPurchaseButtonText}</div>
          )}
        </div>
        <div className={descriptionContainer}>
          <div className={descriptionText}>
            <span>{description}</span>
          </div>
          {isEntitled && !isCompatiblePlatform && (
            <span className={notSupportedText}>
              {browserDeviceNotSupported}
            </span>
          )}
          {isLoading ? (
            <Spinner className={epgDetailsOverlaySpinner} />
          ) : (
            <div className={buttonsContainer}>
              {isAvailableToBuyOrPlay && !isFutureProgram && (
                <Button
                  light
                  hasLeftIcon
                  displayText={playButtonText}
                  onClick={playButtonAction}
                  {...isLoggedIn && isEntitled && playIconProps}
                />
              )}
              <Button
                white
                displayText={epgViewDetails}
                onClick={navigateToDetails}
              />
            </div>
          )}
        </div>
      </div>
      <div className={closeIcon} onClick={closeOverlay}>
        <CrossIcon />
      </div>
    </div>
  );
};

EpgDetailsOverlay.propTypes = {
  closeOverlay: PropTypes.func,
  description: PropTypes.string,
  endTime: PropTypes.number,
  entitlements: PropTypes.object,
  epgDetailsLoading: PropTypes.bool,
  genres: PropTypes.arrayOf(PropTypes.string),
  history: PropTypes.object,
  id: PropTypes.string,
  image: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  messages: PropTypes.object,
  navigateAwayFromPage: PropTypes.func,
  playerInstanceFromContext: PropTypes.object,
  playVideo: PropTypes.func,
  productRefs: PropTypes.array,
  products: PropTypes.array,
  programId: PropTypes.string,
  rating: PropTypes.string,
  showParentalCheck: PropTypes.bool,
  startTime: PropTypes.number,
  title: PropTypes.string,
  epgStreamUrl: PropTypes.object,
  loadStreamUrl: PropTypes.func,
  streamUrlLoading: PropTypes.bool
};

export default EpgDetailsOverlay;
