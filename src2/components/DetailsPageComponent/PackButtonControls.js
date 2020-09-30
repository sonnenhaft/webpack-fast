import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '#/components/Button/Button';
import { isMobile } from '#/utils/getPlatform';
import { PAYMENT_CODES, ROUTE } from '#/constants';

import Spinner from '#/components/Spinner/Spinner';

import {
  packButtonControlsContainer,
  purchaseSpinner,
  uppercaseButtonText,
  whiteBorderButton
} from './packButtonControls.scss';

const { LOGIN, PACKS_LISTING } = ROUTE;
const { paymentOk } = PAYMENT_CODES;

const WHATS_INSIDE_OPTIONS = {
  deeplink: 'DeepLink',
  externalUrl: 'External URL',
  popup: 'Popup',
  hide: 'Hide'
};

const PackButtonControls = ({
  detailsPageData = {},
  history = {},
  isEntitled,
  isLoggedIn,
  messages = {},
  purchaseButtonInfo = {}
}) => {
  const {
    denomination,
    price,
    products,
    whatsInsideCTA,
    packId
  } = detailsPageData;
  const [pack] = products || [];
  const { pack: [{ purchasableUfinityProduct } = {}] = [] } = pack || {};
  const { priceFinal } = purchasableUfinityProduct || {};
  const { purchaseButtonCta, purchaseData } = purchaseButtonInfo;
  const {
    loading: purchaseLoading,
    data: { purchase: { code } = {} } = {},
    error
  } = purchaseData;
  const isSuccess = code === paymentOk && !error;
  const isPurchaseButtonShown =
    purchasableUfinityProduct && !isEntitled && !purchaseLoading && !isSuccess;
  const isSpinnerShown = purchaseLoading || isSuccess;
  const {
    detailPeriodRegex,
    detailPriceRegex,
    detailBuyButtonText,
    whatsInsideText
  } = messages;

  const detailBuyText = detailBuyButtonText
    .replace(detailPriceRegex, priceFinal || price)
    .replace(detailPeriodRegex, denomination);
  const secondaryButtonClass = classNames(
    uppercaseButtonText,
    whiteBorderButton
  );

  const purchaseButtonClick = isLoggedIn
    ? purchaseButtonCta
    : () => history.push(LOGIN);

  const whatsInsideAction = ({ cta, ctaParam }) => {
    switch (cta) {
      case WHATS_INSIDE_OPTIONS.deeplink:
        history.push(`${PACKS_LISTING}/${ctaParam}`);

        break;

      case WHATS_INSIDE_OPTIONS.externalUrl:
        if (__CLIENT__) {
          window.location = ctaParam;
        }

        break;

      default:
        return null;
    }
  };
  const onClickWhatsInside = () =>
    whatsInsideAction({ cta: whatsInsideCTA, ctaParam: packId });

  return (
    <div className={packButtonControlsContainer}>
      {isPurchaseButtonShown && (
        <Button
          light
          displayText={detailBuyText}
          onClick={purchaseButtonClick}
        />
      )}
      {isSpinnerShown && <Spinner className={purchaseSpinner} />}
      {!isMobile() && (
        <Button
          dark
          className={secondaryButtonClass}
          displayText={whatsInsideText}
          onClick={onClickWhatsInside}
        />
      )}
    </div>
  );
};

PackButtonControls.propTypes = {
  detailsPageData: PropTypes.object,
  history: PropTypes.object,
  isEntitled: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  messages: PropTypes.object,
  purchaseButtonInfo: PropTypes.shape({
    purchaseButtonCta: PropTypes.func,
    purchaseButtonText: PropTypes.string
  })
};

export default PackButtonControls;
