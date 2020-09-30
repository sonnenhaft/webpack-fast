import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Redirect } from 'react-router-dom';

import { filterListingData } from '#/services/ovp/implementations/nagra';
import { getAssetListing, purchaseHelper } from './assetListingHelpers';

import { AuthContext } from '#/utils/context';
import { useDestructureFromAuthContext } from '#/helpers/hooks';
import Container from '#/containers/Container/Container';
import Button from '#/components/Button/Button';
import ListingContainer from './ListingContainer';
import CategorySidePanel from './CategorySidePanel';
import Modal from '#/components/Modal/Modal';
import Spinner from '#/components/Spinner/Spinner';
import PinInputModal from '#/containers/PinInputModal/PinInputModal';
import { useParentalCheck } from '#/views/CommonDetailsPage/usePinHook';
import { useParentalSettings } from '#/services/settings';

import { SortByIcon } from '#/components/Icons';

import { getEntitlement, noop, createHeaders } from '#/helpers';
import { ROUTE, RAIL_SORT, authenticatedListing } from '#/constants';
import {
  AccedoOneContainerCardType,
  AccedoOneItemAction
} from '#/config/templates';

import {
  fullWidthListingInnerContainer,
  fullWidthOuterContainer,
  listingInnerContainer,
  outerContainer,
  gridSpinner
} from './assetListing.scss';

const LISTING = 'listing';

const { DETAILS_LISTING } = ROUTE;

const { Landscape, Portrait } = AccedoOneContainerCardType;
const { Vod } = AccedoOneItemAction;

const AssetListing = ({ location = {}, match = {}, messages = {} }) => {
  const assetListingIdPath = location.pathname.split('/');
  const assetListingId = assetListingIdPath[assetListingIdPath.length - 1];
  const { path } = match;
  const isDetailsListing = path === DETAILS_LISTING;
  if (!assetListingId || assetListingId === LISTING) {
    return <Redirect to={ROUTE.HOME} />;
  }

  const {
    detailBuyButtonText,
    detailPeriodRegex,
    detailPriceRegex,
    listingCat_web: listingCat,
    sortAlphabetical,
    sortDate
  } = messages;

  const [sortBy, setSortBy] = useState(sortDate);
  const [filter, setFilter] = useState('');

  const {
    hasParentalPinCheck,
    setIsParentalPinValid,
    setParentalPinCheck
  } = useParentalCheck();

  const [
    fetchParentalSettings,
    { data: parentalSettingsData }
  ] = useParentalSettings({ isLazy: true });

  const {
    entitlements = {},
    isLoggedIn,
    nagraToken,
    ufinityToken
  } = useDestructureFromAuthContext(AuthContext);

  const {
    parentalPin: {
      isEnabled,
      settings: { restrictInAppPurchasesByPin } = {}
    } = {}
  } = parentalSettingsData || {};

  const { data, loading, purchaseInfo } = getAssetListing({
    assetListingId,
    path,
    authenticatedListing
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchParentalSettings();
    }
  }, []);

  const {
    container,
    details: {
      __typename,
      episodes: seriesEpisodes = [],
      title,
      page,
      series: { episodes: editorialEpisodes = [] } = {}
    } = {}
  } = data || {};

  const episodes =
    __typename === 'Editorial' ? editorialEpisodes : seriesEpisodes;

  const {
    id,
    _meta: { id: containerId, entryAlias: containerAlias } = {},
    action,
    appliedFilter,
    displayText,
    nagraFilters = [],
    rail: railItems
  } = container || {};

  const { cardType: episodesCardType } =
    (page?.containers || []).find(item => item?.action === Vod) || {};

  const { items } = railItems || {};

  const { displayText: appliedFilterDisplayText } = appliedFilter || {};
  const {
    denomination,
    price,
    productId: nagraProductId,
    productRefs,
    purchasableUfinityProduct,
    title: packTitle
  } = purchaseInfo || {};
  const { priceFinal, productId: ufinityProductId } =
    purchasableUfinityProduct || {};

  // purchase related

  const isEntitled = getEntitlement({ entitlements, productRefs });
  const [modalProps, setModalProps] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [purchasedContent, setPurchasedContent] = useState(null);
  const toggleModal = () => {
    if (showModal) {
      setPurchasedContent(null);
    }
    setShowModal(!showModal);
  };
  const { onClickPurchase, purchaseDisabled } = purchaseHelper({
    messages,
    purchasedContent,
    setModalProps,
    setPurchasedContent,
    setShowModal
  });

  const buyPackButtonPress = () =>
    onClickPurchase({
      displayText: packTitle,
      nagraProductId,
      ufinityProductId
    });

  const onPinValid = isValid => {
    if (!isValid) {
      return;
    }

    buyPackButtonPress();
  };

  const pinInputProps = {
    hasPinCheck: hasParentalPinCheck,
    pinValidAction: onPinValid || noop,
    setIsPinValid: setIsParentalPinValid,
    setPinCheck: setParentalPinCheck,
    type: 'parental',
    isPlayback: false
  };

  const onBuyBtnClick = () => {
    if (isEnabled && restrictInAppPurchasesByPin) {
      setParentalPinCheck(true);

      return;
    }

    buyPackButtonPress();
  };

  const [
    lazyloadListingData,
    {
      data: { container: { rail: { items: filteredItems } = {} } = {} } = {},
      loading: filterLoading
    }
  ] = filterListingData({
    id: containerAlias || containerId || assetListingId
  });

  const toggleSortBy = () => {
    const isAlphabetical = sortBy === sortAlphabetical;
    setSortBy(isAlphabetical ? sortDate : sortAlphabetical);

    const isAuthQuery = authenticatedListing.includes(assetListingId);

    lazyloadListingData({
      variables: {
        filter,
        order: isAlphabetical ? RAIL_SORT.A_Z : RAIL_SORT.DATE_SORTING,
        asc: !!isAlphabetical
      },
      ...(isAuthQuery && {
        context: {
          headers: createHeaders({ nagraToken, ufinityToken })
        }
      })
    });
  };

  const buyPackText =
    priceFinal || price
      ? detailBuyButtonText
          .replace(detailPriceRegex, priceFinal || price)
          .replace(detailPeriodRegex, denomination)
      : '';
  const hasBuyPackButton = Boolean(buyPackText && buyPackButtonPress);
  const selectedCategoryPosition = (nagraFilters || []).reduce(
    (originalCategoryIndex, { displayText: categoryText }, categoryIndex) => {
      if (appliedFilterDisplayText === categoryText) {
        return categoryIndex;
      }

      return originalCategoryIndex;
    },
    0
  );

  const [selectedCategory, setSelectedCategory] = useState(
    selectedCategoryPosition
  );
  const [assetListingItems, setAssetListingItems] = useState(null);

  const changeCategory = ({ categoryId, categoryIndex }) => {
    setSortBy(sortDate);
    setFilter(categoryId);
    lazyloadListingData({ variables: { filter: categoryId } });
    setSelectedCategory(categoryIndex);
  };

  const listingInnerContainerClass = classNames(listingInnerContainer, {
    [fullWidthListingInnerContainer]: isDetailsListing
  });
  const outerContainerClass = classNames(outerContainer, {
    [fullWidthOuterContainer]: isDetailsListing
  });

  useEffect(() => {
    setAssetListingItems(filteredItems || items);
  }, [filteredItems, items]);

  const itemsLength = Boolean((assetListingItems || episodes)?.length);

  const cardType = action === Vod ? Portrait : Landscape;

  const buttonSection = (
    <Fragment>
      {!isDetailsListing && itemsLength && (
        <Button
          dark
          onClick={toggleSortBy}
          displayText={sortBy}
          Icon={SortByIcon}
        />
      )}
      {hasBuyPackButton && !isEntitled && (
        <Button
          light
          onClick={onBuyBtnClick || noop}
          displayText={buyPackText}
          loading={purchaseDisabled}
        />
      )}
    </Fragment>
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <ListingContainer
      buttonSection={buttonSection}
      displayText={displayText}
      match={match}
      title={title}
    >
      <div className={listingInnerContainerClass}>
        {!isDetailsListing && (
          <CategorySidePanel
            categories={nagraFilters}
            changeCategory={changeCategory}
            listingCat={listingCat}
            selectedCategory={selectedCategory}
          />
        )}
        {filterLoading ? (
          <Spinner className={gridSpinner} />
        ) : (
          <Container
            action={action}
            className={outerContainerClass}
            rail={{ items: assetListingItems || episodes }}
            cardType={episodesCardType || cardType}
            template="grid"
            id={id}
          />
        )}
      </div>
      <Modal
        showModal={modalProps && showModal}
        toggleModal={toggleModal}
        {...modalProps}
      />
      <PinInputModal {...pinInputProps} />
    </ListingContainer>
  );
};

AssetListing.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  messages: PropTypes.object
};

export default AssetListing;
