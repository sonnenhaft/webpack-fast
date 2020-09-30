import React, { Fragment, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { AuthContext } from '#/utils/context';
import { useMultiPackDetails } from '#/services/purchase';
import { useDestructureFromAuthContext } from '#/helpers/hooks';

import ListingContainer from './ListingContainer';
import TermsAndConditions from '#/containers/TermsAndConditions/TermsAndConditionsContainer';
import Modal from '#/components/Modal/Modal';
import Button from '#/components/Button/Button';
import PinInputModal from '#/containers/PinInputModal/PinInputModal';
import { useParentalCheck } from '#/views/CommonDetailsPage/usePinHook';
import { useParentalSettings } from '#/services/settings';

import { noop, numOfKeys } from '#/helpers';

import { purchaseHelper } from './assetListingHelpers';

import {
  multiPackContainer,
  multiPackSubtext,
  multiPackText,
  packContainer,
  singlePackButton,
  singlePackContainer,
  singlePackContent,
  singlePackPoster,
  singlePackTitle,
  singlePackDescription,
  termsAndConditions
} from './multiPackListing.scss';

const SinglePack = ({
  description = '',
  displayText = '',
  entitlements = {},
  image = '',
  messages = {},
  disabled = false,
  onClick = noop,
  productId: nagraProductId = '',
  purchasableUfinityProduct = {}
}) => {
  const {
    detailBuyButtonText,
    detailPeriodRegex,
    detailPriceRegex,
    monthText
  } = messages;
  const {
    paymentRecurring,
    priceFinal,
    productId: ufinityProductId = '',
    rentalPeriod
  } = purchasableUfinityProduct;
  const priceDenomination = paymentRecurring ? monthText : rentalPeriod;
  const buyButtonText = detailBuyButtonText
    .replace(detailPriceRegex, priceFinal)
    .replace(detailPeriodRegex, priceDenomination);

  const singlePackOnClick = () =>
    onClick({ displayText, nagraProductId, ufinityProductId });

  return (
    <div className={singlePackContainer}>
      <img
        className={singlePackPoster}
        src={image}
        alt={`${displayText}-poster`}
      />
      <div className={singlePackContent}>
        <span className={singlePackTitle}>{displayText}</span>
        <span className={singlePackDescription}>{description}</span>
        {!entitlements?.[nagraProductId] && (
          <Button
            white
            disabled={disabled}
            className={singlePackButton}
            displayText={buyButtonText}
            onClick={singlePackOnClick}
          />
        )}
      </div>
    </div>
  );
};

const MultiPackListing = ({ location = {}, messages = {} }) => {
  const [modalProps, setModalProps] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [purchasedContent, setPurchasedContent] = useState(null);
  const onClickRef = useRef(noop);
  const toggleModal = () => {
    if (showModal) {
      setPurchasedContent(null);
    }
    setShowModal(!showModal);
  };
  const { entitlements = {}, isLoggedIn } = useDestructureFromAuthContext(
    AuthContext
  );

  const { pathname } = location;
  const packIdArray = pathname.split('/');
  const packId = packIdArray[packIdArray.length - 1];

  const {
    okIGotIt,
    packDetailAssetRegex,
    selectPackDescription_web: selectPackDescription,
    selectPackTitle_web: selectPackTitle,
    termsAndConditionDescriptionText
  } = messages;

  const {
    data: {
      details: { channel = {}, products = [], title: vodTitle = '' } = {}
    } = {}
  } = useMultiPackDetails(packId);
  const nonEmptyProducts = products.filter(product => {
    const { pack } = product || {};
    const [singlePack] = pack || [];
    const { purchasableUfinityProduct } = singlePack || {};

    return numOfKeys(purchasableUfinityProduct);
  });
  const {
    channelName,
    nowPlaying: { title: nowPlayingTitle } = {},
    tvChannel
  } = channel || {};
  const multiPackChannelTitle = `${tvChannel} ${channelName} - ${nowPlayingTitle}`;
  const multiPackTitle = tvChannel ? multiPackChannelTitle : vodTitle;
  const selectPackDescriptionWithAsset = selectPackDescription.replace(
    packDetailAssetRegex,
    tvChannel ? `${tvChannel} ${channelName}` : vodTitle
  );

  const { onClickPurchase, purchaseDisabled } = purchaseHelper({
    messages,
    purchasedContent,
    setModalProps,
    setPurchasedContent,
    setShowModal
  });

  const {
    hasParentalPinCheck,
    setIsParentalPinValid,
    setParentalPinCheck
  } = useParentalCheck();

  const pinInputProps = {
    hasPinCheck: hasParentalPinCheck,
    pinValidAction: onClickRef?.current || noop,
    setIsPinValid: setIsParentalPinValid,
    setPinCheck: setParentalPinCheck,
    type: 'parental',
    isPlayback: false
  };

  const [
    fetchParentalSettings,
    { data: parentalSettingData }
  ] = useParentalSettings({ isLazy: true });

  const {
    parentalPin: {
      isEnabled,
      settings: { restrictInAppPurchasesByPin } = {}
    } = {}
  } = parentalSettingData || {};

  useEffect(() => {
    if (isLoggedIn) {
      fetchParentalSettings();
    }
  }, []);

  const initPurchase = (...args) => {
    if (isEnabled && restrictInAppPurchasesByPin) {
      onClickRef.current = isValid => {
        if (!isValid) {
          return;
        }
        onClickPurchase(...args);
      };

      setParentalPinCheck(true);

      return;
    }

    onClickPurchase(...args);
  };

  const packCollection = nonEmptyProducts.map(({ pack }, packIndex) => {
    const [singlePack] = pack || [];
    const { displayText, productId, ...rest } = singlePack || {};

    return (
      <SinglePack
        disabled={purchaseDisabled}
        displayText={displayText}
        entitlements={entitlements}
        key={`${displayText}-${productId}-${packIndex}`}
        messages={messages}
        onClick={initPurchase}
        productId={productId}
        {...rest}
      />
    );
  });

  return (
    <Fragment>
      <ListingContainer displayText={multiPackTitle}>
        <div className={multiPackContainer}>
          <div className={multiPackText}>
            <span>{selectPackTitle}</span>
          </div>
          <div className={multiPackSubtext}>
            <span>{selectPackDescriptionWithAsset}</span>
          </div>
          <div className={packContainer}>{packCollection}</div>
          <TermsAndConditions
            acknowledgeText={okIGotIt}
            declarationText={termsAndConditionDescriptionText}
            textStyle={termsAndConditions}
          />
        </div>
      </ListingContainer>
      <Modal
        showModal={modalProps && showModal}
        toggleModal={toggleModal}
        {...modalProps}
      />
      <PinInputModal {...pinInputProps} />
    </Fragment>
  );
};

SinglePack.propTypes = {
  description: PropTypes.string,
  displayText: PropTypes.string,
  entitlements: PropTypes.object,
  image: PropTypes.string,
  messages: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  productId: PropTypes.string,
  purchasableUfinityProduct: PropTypes.object
};

MultiPackListing.propTypes = {
  location: PropTypes.object,
  messages: PropTypes.object
};

export default MultiPackListing;
