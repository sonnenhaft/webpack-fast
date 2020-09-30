import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

import { PAYMENT_TYPE } from '#/constants';

import {
  VoucherIcon,
  CreditCardIcon,
  PostPaidIcon,
  InAppPurchaseIcon
} from '#/components/Icons';

import {
  transactionItem,
  transactionDate,
  transactionTitle,
  transactionId,
  transactionPriceContainer,
  transactionPrice,
  transactionPaymentIcon,
  transactionPaymentMethod,
  transactionMetaContainer
} from './transactions.scss';

const TRANSACTION = 'Transaction';

const DATE_FORMAT = 'DD MMMM YYYY, h:mm A';

const mockTransactionId = 'N/A';

const getIcon = type => {
  switch (type?.toLowerCase()) {
    case PAYMENT_TYPE.CREDIT_CARD:
      return CreditCardIcon;
    case PAYMENT_TYPE.VOUCHER_CODE:
      return VoucherIcon;
    case PAYMENT_TYPE.POSTPAID_BILL:
      return PostPaidIcon;
    case PAYMENT_TYPE.IN_APP_PURCHASE:
      return InAppPurchaseIcon;
    default:
      return null;
  }
};

const TransactionItem = ({
  nagraProduct,
  productName,
  datetime,
  priceFinal,
  paymentMethod,
  priceDescription,
  transactionIdPrefix
}) => {
  const { Title = '' } = nagraProduct || {};

  const displayDate = moment(datetime).format(DATE_FORMAT);
  const Icon = getIcon(paymentMethod);

  return (
    <div className={transactionItem}>
      <div className={transactionMetaContainer}>
        <div className={transactionDate}>{displayDate}</div>
        <div className={transactionTitle}>
          {Title || productName || TRANSACTION}
        </div>
        <div className={transactionPriceContainer}>
          <div
            className={transactionId}
          >{`${transactionIdPrefix} : ${mockTransactionId}` /* TODO: replace with real transaction id when available on api response */}</div>
          <div className={transactionPrice}>{`$${priceFinal}`}</div>
        </div>
        <div className={transactionPriceContainer}>
          {Icon && <Icon className={transactionPaymentIcon} />}
          {!Icon && (
            <div className={transactionPaymentMethod}>{paymentMethod}</div>
          )}
          <div className={transactionId}>{priceDescription}</div>
        </div>
      </div>
    </div>
  );
};

TransactionItem.propTypes = {
  datetime: PropTypes.number,
  productName: PropTypes.string,
  nagraProduct: PropTypes.shape({
    Title: PropTypes.string,
    __typename: PropTypes.string
  }),
  priceFinal: PropTypes.number,
  priceDescription: PropTypes.string,
  paymentMethod: PropTypes.string,
  transactionIdPrefix: PropTypes.string
};

export default TransactionItem;
