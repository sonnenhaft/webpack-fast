import React, { useContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import EpgContainer from '#/containers/Epg/EpgContainer';
import NagraPlayerShell from '#/containers/Player/NagraPlayerShell';
import PinInputModal from '#/containers/PinInputModal/PinInputModal';
import { usePlayerRecommendations } from '#/services/ovp/implementations/nagra';
import { AuthContext, EpgContext, PlayerContext } from '#/utils/context';
import {
  showParentalCheckHelper,
  useR21Check,
  useParentalCheck
} from '#/views/CommonDetailsPage/usePinHook';
import { useFavourites } from '#/utils/hooks';
import { useRestrictedChannels } from '#/services/settings';
import { useEntitlement } from '#/services/auth';
import { useDestructureFromAuthContext } from '#/helpers/hooks';
import EpgDetailsOverlay from '#/components/Epg/EpgDetailsOverlay';

import { getCurrentLinearProgram } from './getCurrentLinearProgramHelper';
import { useStreamUrlForEpg } from './timeshiftHelper';

import { EPG_PLAYER_ACTION, R21 } from '#/constants';

import { playerContainer, visible } from './epgPage.scss';

const { makePlayerVisible, replayPlayer, unloadPlayer } = EPG_PLAYER_ACTION;
const EpgPage = ({ epgCategories, history = {}, messages = {} }) => {
  const {
    programSelectedInfo,
    setProgramSelected,
    setProgramSelectedInfo,
    programSelected = {}
  } = useContext(EpgContext);

  const { channelId, programId: selectedProgramId } = programSelected || {};

  const [
    fetchRestrictedChannels,
    { data: parentalSettingsData }
  ] = useRestrictedChannels({
    isLazy: true
  });

  const { parentalPin: { restrictedChannels = [] } = {} } =
    parentalSettingsData || {};

  const { playerInstanceFromContext } = useContext(PlayerContext);
  const { isLoggedIn, nagraToken } = useDestructureFromAuthContext(AuthContext);
  const { entitlements, fetchEntitlement } = useEntitlement({
    nagraToken,
    refetch: true
  });
  const [isNavigatingTo, setNavigatingTo] = useState('');
  const { id: programId, rating } = programSelectedInfo || {};
  const isR21 = rating === R21;
  const showParentalCheckForChannel = showParentalCheckHelper({
    id: channelId,
    isLinearDetails: true,
    parentalSettingsData,
    rating,
    restrictedChannels
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchRestrictedChannels();
      fetchEntitlement();
    }
  }, []);

  const epgPlayerInitialState = {
    isPlayerLoaded: false,
    isPlayerVisible: false,
    isPlayerReplayed: false
  };

  const epgPlayerReducer = (
    epgPlayerState = epgPlayerInitialState,
    playerAction
  ) => {
    switch (playerAction.type) {
      case EPG_PLAYER_ACTION.loadPlayer:
        return {
          ...epgPlayerState,
          isPlayerLoaded: true,
          isPlayerReplayed: false
        };

      case EPG_PLAYER_ACTION.unloadPlayer:
        return {
          ...epgPlayerState,
          isPlayerLoaded: false,
          isPlayerVisible: false
        };

      case EPG_PLAYER_ACTION.makePlayerVisible:
        return { ...epgPlayerState, isPlayerVisible: true };

      case EPG_PLAYER_ACTION.replayPlayer:
        return {
          ...epgPlayerState,
          isPlayerLoaded: true,
          isPlayerVisible: false,
          isPlayerReplayed: true
        };

      case EPG_PLAYER_ACTION.playerStartReplay:
        return {
          ...epgPlayerState,
          isPlayerReplayed: false
        };

      default:
        return { ...epgPlayerState };
    }
  };

  const [epgPlayerState, epgPlayerDispatch] = useReducer(
    epgPlayerReducer,
    epgPlayerInitialState
  );
  const { isPlayerLoaded, isPlayerReplayed, isPlayerVisible } = epgPlayerState;

  const closeOverlay = () => {
    setProgramSelected({});
    setProgramSelectedInfo({});
    epgPlayerDispatch({ type: unloadPlayer });
  };

  const currentProgramId =
    programSelectedInfo?.nowPlaying?.id || selectedProgramId;

  const [
    toggleFavourites,
    { toggleFavLoading, isFavourite, fetchFavouriteState }
  ] = useFavourites({
    channelId,
    isLinearDetails: true,
    programId: currentProgramId,
    isChannelPage: false,
    isEpgPage: true
  });

  const [
    loadPlayerRecommendations,
    { data: { playerDetails: { page } = {} } = {} }
  ] = usePlayerRecommendations(programId);

  const { containersData: playerRecommendations } = page || {};
  useEffect(() => {
    if (isLoggedIn && currentProgramId) {
      loadPlayerRecommendations({ variables: { id: currentProgramId } });
      fetchFavouriteState({
        variables: { programId: currentProgramId, channelId }
      });
    }
  }, [currentProgramId]);

  const favouriteBtnControls = {
    isLinearDetails: true,
    onClick: toggleFavourites,
    loading: toggleFavLoading,
    isFavourite
  };

  const playVideo = async (
    videoState,
    { isPinValid, showParentalCheck } = {}
  ) => {
    /* eslint-disable no-use-before-define */
    if (videoState && isR21 && !isR21PinValid) {
      setR21PinCheck(isR21);

      return;
    }

    if (videoState && !isR21 && showParentalCheck && !isPinValid) {
      setParentalPinCheck(true);

      return;
    }
    /* eslint-enable no-use-before-define */

    if (videoState) {
      epgPlayerDispatch({ type: makePlayerVisible });

      try {
        await playerInstanceFromContext?.play();
      } catch (e) {
        playerInstanceFromContext?.muted(true);
        await playerInstanceFromContext?.play();

        playerInstanceFromContext.volume(0);
      }

      return;
    }

    epgPlayerDispatch({ type: replayPlayer });
  };

  const {
    hasR21PinCheck,
    isR21PinValid,
    setIsR21PinValid,
    setR21PinCheck
  } = useR21Check();

  const {
    hasParentalPinCheck,
    setIsParentalPinValid,
    setParentalPinCheck
  } = useParentalCheck();

  const navigateAwayFromPage = detailsPageRoute => {
    playVideo(false);
    setNavigatingTo(detailsPageRoute);
  };

  const isPinInputVisible = hasR21PinCheck || hasParentalPinCheck;
  const isR21PinInput = hasR21PinCheck && !hasParentalPinCheck;

  const playerContainerClass = classNames(playerContainer, {
    [visible]: isPlayerVisible
  });

  const { epgStreamUrl, loadStreamUrl, streamUrlLoading } = useStreamUrlForEpg(
    programSelectedInfo
  );

  const loadCurrentLinearDetails = getCurrentLinearProgram({
    messages,
    parentalSettingsData,
    playerInstanceFromContext,
    setProgramSelectedInfo
  });

  useEffect(() => {
    if (programId && isLoggedIn) {
      epgPlayerDispatch({ type: replayPlayer });
    }
  }, [programId]);

  useEffect(() => {
    if (isNavigatingTo) {
      history.push(isNavigatingTo);
    }
  }, [isNavigatingTo, playerInstanceFromContext]);

  const pinInputProps = {
    hasPinCheck: isR21PinInput ? hasR21PinCheck : hasParentalPinCheck,
    pinValidAction: playVideo,
    setIsPinValid: isR21PinInput ? setIsR21PinValid : setIsParentalPinValid,
    setPinCheck: isR21PinInput ? setR21PinCheck : setParentalPinCheck,
    type: isR21PinInput ? 'r21' : 'parental'
  };

  return (
    <div>
      {!isPlayerVisible && (
        <EpgContainer
          epgCategories={epgCategories}
          epgPlayerDispatch={epgPlayerDispatch}
          history={history}
          messages={messages}
          parentalSettingsData={parentalSettingsData}
          restrictedChannels={restrictedChannels}
        />
      )}
      {isLoggedIn && isPlayerLoaded && (
        <div className={playerContainerClass}>
          <NagraPlayerShell
            isEpgPage
            epgPlayerDispatch={epgPlayerDispatch}
            history={history}
            isPlayerReplayed={isPlayerReplayed}
            loadCurrentLinearDetails={loadCurrentLinearDetails}
            playVideo={playVideo}
            playerVisibility={isPlayerVisible}
            programSelectedInfo={programSelectedInfo}
            recommendations={playerRecommendations}
            streamUrl={epgStreamUrl}
            showBingeParentalCheck={{
              next: showParentalCheckForChannel,
              prev: showParentalCheckForChannel
            }}
            favouriteBtnControls={favouriteBtnControls}
          />
        </div>
      )}
      {programId && (
        <EpgDetailsOverlay
          closeOverlay={closeOverlay}
          entitlements={entitlements}
          history={history}
          isLoggedIn={isLoggedIn}
          messages={messages}
          navigateAwayFromPage={navigateAwayFromPage}
          playerInstanceFromContext={playerInstanceFromContext}
          playVideo={playVideo}
          showParentalCheck={showParentalCheckForChannel}
          {...{
            ...programSelectedInfo,
            ...programSelected,
            epgStreamUrl,
            loadStreamUrl,
            streamUrlLoading
          }}
        />
      )}
      {isPinInputVisible && <PinInputModal {...pinInputProps} />}
    </div>
  );
};

EpgPage.propTypes = {
  epgCategories: PropTypes.array,
  history: PropTypes.object,
  messages: PropTypes.object
};

export default EpgPage;
