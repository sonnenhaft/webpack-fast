import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';

import { SortByIcon } from '#/components/Icons';

import { usePaymentTransactions, useFilterList } from '#/services/transactions';
import PageTitle from '#/components/PageTitle/PageTitle';
import SubSection from '#/components/SubSection/SubSection';
import Button from '#/components/Button/Button';
import Spinner from '#/components/Spinner/Spinner';
import { noop } from '#/helpers';

import RangeMenu from './RangeMenu';
import TransactionItem from './TransactionItem';

import {
  mainTitle,
  pageHeader,
  mostRecentButton,
  listingSpinner,
  transactionsContainer,
  transactionSpinner,
  transactionSeperator,
  transactionSubsection,
  noTransactions
} from './transactions.scss';

const TRANSACTIONS_TITLE = 'transactionsPageTitle';
const TRANSACTIONS_PRICE = 'transactionsPriceDesc';
const NO_TRANSACTIONS = 'transactionsNoTransactions';
const ID_PREFIX = 'transactionsIdPrefix';

const TransactionList = ({ transactions, getMessage = noop }) => (
  <div className={transactionsContainer}>
    {transactions?.length ? (
      transactions.map((transaction, idx) => (
        <TransactionItem
          {...transaction}
          key={`transaction-${idx}`}
          priceDescription={getMessage(TRANSACTIONS_PRICE)}
          transactionIdPrefix={getMessage(ID_PREFIX)}
        />
      ))
    ) : (
      <div className={noTransactions}>{getMessage(NO_TRANSACTIONS)}</div>
    )}
  </div>
);

const Transactions = ({ messages }) => {
  const getMessage = key => messages[key] || '';

  const [
    fetchTransactions,
    { data: { paymentTransactions = [] } = {}, loading }
  ] = usePaymentTransactions();

  const { filters, filterLoading } = useFilterList();

  const [selectedFilter, setSelectedFilter] = useState({});

  const loadFilteredTransactions = (filter = filters[0]) => {
    if (filter?.name === selectedFilter?.name) {
      return;
    }

    const { value } = filter || {};
    const to = moment().valueOf();
    const from = moment()
      .subtract(value, 'days')
      .valueOf();

    fetchTransactions({
      variables: { to, from }
    });
    setSelectedFilter(filter);
  };

  useEffect(() => {
    if (filters?.length) {
      loadFilteredTransactions();
    }
  }, [filters]);

  if (filterLoading) {
    return <Spinner className={transactionSpinner} />;
  }

  const enableMenu = Boolean(filters?.length && !loading);

  return (
    <Fragment>
      <div className={pageHeader}>
        <PageTitle
          text={getMessage(TRANSACTIONS_TITLE)}
          className={mainTitle}
        />
        {selectedFilter?.title && (
          <Button
            dark
            className={mostRecentButton}
            displayText={selectedFilter?.title}
            Icon={SortByIcon}
          >
            {enableMenu && (
              <RangeMenu
                filters={filters}
                onSelect={loadFilteredTransactions}
              />
            )}
          </Button>
        )}
      </div>
      <SubSection
        className={transactionSubsection}
        seperatorClassName={transactionSeperator}
      >
        {loading ? (
          <Spinner className={listingSpinner} />
        ) : (
          <TransactionList
            transactions={paymentTransactions}
            getMessage={getMessage}
          />
        )}
      </SubSection>
    </Fragment>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array,
  getMessage: PropTypes.func
};

Transactions.propTypes = {
  messages: PropTypes.object
};

export default Transactions;
