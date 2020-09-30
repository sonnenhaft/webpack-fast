import { useContext, useState } from 'react';
import { ConfigContext } from '#/utils/context';

import {
  DEFAULT_RATING_WEIGHT,
  PIN_VOD_TIMEOUT_MS,
  VJS_CUSTOM_COMPONENTS
} from '#/constants';
import { numOfKeys, showParentalCheckForChannel } from '#/helpers';

let timeout;

const { BACK_BUTTON } = VJS_CUSTOM_COMPONENTS;

const clearPinTimeout = () => {
  clearTimeout(timeout);
  timeout = null;
};

export const useR21Check = () => {
  const [hasR21PinCheck, setR21PinCheck] = useState(false);
  const [isR21PinValid, setIsR21PinValid] = useState(false);

  return {
    hasR21PinCheck,
    isR21PinValid,
    setIsR21PinValid,
    setR21PinCheck
  };
};

export const usePinTimeout = ({
  isPinRequired,
  playerInstanceFromContext,
  setIsPinValid,
  setPinCheck
}) => {
  const [timeoutPinCheck, setTimeoutPinCheck] = useState(false);

  if (isPinRequired && timeoutPinCheck && !timeout) {
    timeout = setTimeout(() => {
      setTimeoutPinCheck(!timeoutPinCheck);
      playerInstanceFromContext?.getChild(BACK_BUTTON).trigger('click');
      setIsPinValid(false);
      setPinCheck(true);
      clearPinTimeout();
    }, PIN_VOD_TIMEOUT_MS);
  }

  return {
    clearPinTimeout,
    setTimeoutPinCheck,
    timeout,
    timeoutPinCheck
  };
};

export const useParentalCheck = () => {
  const [hasParentalPinCheck, setParentalPinCheck] = useState(false);
  const [isParentalPinValid, setIsParentalPinValid] = useState(false);

  return {
    hasParentalPinCheck,
    isParentalPinValid,
    setIsParentalPinValid,
    setParentalPinCheck
  };
};

export const showParentalCheckHelper = ({
  id,
  isLinearDetails,
  parentalSettingsData = {},
  rating,
  restrictedChannels,
  tvChannel
}) => {
  const { ratingWeights } = useContext(ConfigContext) || {};

  const {
    parentalPin: {
      isEnabled,
      maxRating,
      settings: { restrictContentByPin, restrictChannelsByPin } = {}
    } = {}
  } = parentalSettingsData || {};

  const contentRatingWeight = ratingWeights[rating] || 0;
  const maxRatingWeight = ratingWeights[maxRating] || DEFAULT_RATING_WEIGHT;
  const showParentalPinPopup = contentRatingWeight >= maxRatingWeight;

  const restrictByRating = isEnabled && restrictContentByPin;
  const restrictByChannel = isEnabled && restrictChannelsByPin;

  const showChannelParentalPopup = showParentalCheckForChannel(
    tvChannel,
    id,
    restrictedChannels
  );

  const channelParentalPopup =
    restrictByChannel && Boolean(numOfKeys(showChannelParentalPopup));
  const vodParentalPopup = restrictByRating && showParentalPinPopup;

  const showParentalCheck = isLinearDetails
    ? channelParentalPopup || vodParentalPopup
    : vodParentalPopup;

  return showParentalCheck;
};
