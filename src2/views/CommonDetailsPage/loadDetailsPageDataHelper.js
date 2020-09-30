import React, { useContext, useEffect, useState } from 'react';
import {
  useAssetDetails,
  useLastPlayedEpisode
} from '#/services/ovp/implementations/nagra';
import {
  usePackDetails,
  usePurchaseMutation,
  useRedirectToLogin
} from '#/services/purchase';
import { useEntitlement } from '#/services/auth';

import { AuthContext, ConfigContext } from '#/utils/context';
import SeasonSelector from '#/components/DetailsPageComponent/SeasonSelector';
import { purchaseModalProps } from '#/views/AssetListing/utils/constants';

import { OVPItemType } from '#/config/templates';
import { createHeaders, numOfKeys } from '#/helpers';
import { useDestructureFromAuthContext } from '#/helpers/hooks';
import { ASSET_ITEM_TYPENAME, PAYMENT_CODES, ROUTE } from '#/constants';

const {
  LINEAR_DETAILS,
  MOVIE_DETAILS,
  MULTI_PACKS,
  PACK_DETAILS,
  SERIES_DETAILS
} = ROUTE;
const { paymentOk } = PAYMENT_CODES;

const configToRailMapping = {
  cast_crew: 'cast_crew',
  episodes: 'episodes',
  'recommend-linear': 'recommendations',
  'recommend-vod': 'recommendations',
  seasons: 'seasons',
  vod: 'vod'
};

const CAST_CREW_RAIL_ITEM_PADDING = 8;

const { editorial } = ASSET_ITEM_TYPENAME;

export const loadDetailsPageData = ({ pageType, contentId }) => {
  const { state: { isLoggedIn } = {} } = useContext(AuthContext);

  switch (pageType) {
    case MOVIE_DETAILS:
    case SERIES_DETAILS:
    case LINEAR_DETAILS: {
      const [assetDetailsQuery, { data, error, loading } = {}] =
        useAssetDetails({ id: contentId, hasRefreshCheck: true }) || [];

      const [fetchLastPlayedEpisode, { data: lastPlayedData }] =
        useLastPlayedEpisode({ id: contentId, hasRefreshCheck: true }) || [];
      const { details } = data || {};
      const { lastPlayedEpisode: lastPlayedEpisodeData } = lastPlayedData || {};

      return [
        assetDetailsQuery,
        {
          details,
          loading,
          error,
          lastPlayedEpisodeData,
          fetchLastPlayedEpisode
        }
      ];
    }

    case PACK_DETAILS: {
      const [
        packDetailsQuery,
        { data: { packDetails: details = {} } = {}, loading }
      ] = usePackDetails({ packId: contentId, isLoggedIn });
      const { productId, purchasableUfinityProduct, title, ...rest } =
        details || {};
      const detailsWithProductsField = {
        products: [
          {
            pack: [
              {
                displayText: title,
                productId,
                purchasableUfinityProduct
              }
            ]
          }
        ],
        packId: contentId,
        title,
        ...rest
      };

      return [packDetailsQuery, { details: detailsWithProductsField, loading }];
    }

    default:
      return [];
  }
};

const seasonDataHandler = ({ railData = [], selectedIndex }) => {
  const { seasonNumber: selectedSeasonNumber, ...rest } =
    railData?.[selectedIndex] || {};
  const selectionData = railData?.map(
    ({ seasonNumber }) => `Season ${seasonNumber}`
  );

  return {
    selectionData,
    ...(selectedSeasonNumber && {
      displayText: `Season ${selectedSeasonNumber}`
    }),
    ...rest
  };
};

const getRailData = (action, detailsPageData) => {
  const { season, series, __typename } = detailsPageData || {};
  const recommendationKeys = Object.keys(configToRailMapping).filter(key =>
    key.includes('recommend')
  );

  if (action === configToRailMapping.vod) {
    if (__typename === editorial && (numOfKeys(season) || numOfKeys(series))) {
      return (
        series?.[configToRailMapping.seasons] || [
          { episodes: series?.[configToRailMapping.episodes] }
        ]
      );
    }

    return (
      detailsPageData[configToRailMapping.seasons] || [
        {
          episodes: detailsPageData[configToRailMapping.episodes]
        }
      ]
    );
  }
  if (recommendationKeys.includes(action)) {
    const { detailsPage: { containersData } = {} } = detailsPageData;

    return containersData.find(
      ({ action: actionConfig }) => actionConfig === action
    ).rail?.items;
  }

  return detailsPageData[configToRailMapping[action]];
};

export const railsDataHandler = ({ detailsPageData }) => {
  const { lastPlayedSeason, seasons, id } = detailsPageData || {};
  const { seasonNumber: savedSeasonNumber } =
    lastPlayedSeason?.lastPlayedEpisode || {};

  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (savedSeasonNumber) {
      const savedSeasonIndex = (seasons || []).findIndex(
        ({ seasonNumber }) => seasonNumber === savedSeasonNumber
      );
      setSelectedIndex(savedSeasonIndex);
    }
  }, [savedSeasonNumber]);

  const { maxItemsInRail } = useContext(ConfigContext);

  const { detailsPage } = detailsPageData || {};
  const { containersData = [] } = detailsPage || {};
  const railsArray = containersData?.reduce(
    (renderedRails, containerConfig) => {
      const { action } = containerConfig;
      const railData = getRailData(action, detailsPageData);

      const isSeasonsRail = action === configToRailMapping.vod;
      const { episodes, episodesCount, seasonId, ...seasonSelectorProps } =
        isSeasonsRail && seasonDataHandler({ railData, selectedIndex });
      const renderedRailItems = isSeasonsRail ? episodes : railData;
      // TODO - middleware - totalCount logic is not working for details page rails, using this hack to pass SHH-1726 first
      const renderedRail = isSeasonsRail
        ? {
            items: episodes,
            totalCount:
              episodes?.length > maxItemsInRail
                ? episodesCount + 1
                : episodesCount
          }
        : { items: railData };

      const isCastCrewRail = action === configToRailMapping.cast_crew;

      if (!renderedRailItems?.length) {
        return renderedRails;
      }

      return [
        ...renderedRails,
        {
          ...containerConfig,
          ...(isSeasonsRail && {
            containerSubComponent: (
              <SeasonSelector
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                {...seasonSelectorProps}
              />
            ),
            id: seasonId,
            isContainerOnDetailsPage: true
          }),
          ...(isCastCrewRail && {
            itemType: OVPItemType.CastCrew,
            fixedPadding: CAST_CREW_RAIL_ITEM_PADDING
          }),
          ...(action === configToRailMapping.vod && { id }),
          rail: renderedRail
        }
      ];
    },
    []
  );

  return railsArray;
};

export const purchaseHandler = ({
  contentId = '',
  history = {},
  isParentalPinEnabled,
  isParentalPinValid,
  messages = {},
  products = [],
  setParentalPinCheck
}) => {
  const [getProductData, productData] =
    useAssetDetails({ id: contentId }) || [];

  const { data } = productData || {};
  const {
    details: { products: productsFromFirstSeasonOrEp, rating: assetRating } = {}
  } = data || {};

  const [modalProps, setModalProps] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const { fetchEntitlement } = useEntitlement();
  const { nagraToken } = useDestructureFromAuthContext(AuthContext);

  useEffect(() => {
    getProductData();
  }, []);

  const {
    detailPeriodRegex,
    detailPriceRegex,
    detailBuyButtonText,
    detailRentButtonText,
    detailViewSubsPackBtn
  } = messages;

  const nonEmptyProducts = (
    productsFromFirstSeasonOrEp ||
    products ||
    []
  ).reduce((accumulator, singlePack) => {
    const { pack } = singlePack || {};
    const purchasablePacks = (pack || []).filter(
      ({ purchasableUfinityProduct }) => numOfKeys(purchasableUfinityProduct)
    );

    return [...accumulator, ...purchasablePacks];
  }, []);

  const [
    {
      denomination,
      displayText,
      productId: nagraProductId = '',
      purchasableUfinityProduct: {
        paymentRecurring,
        priceFinal,
        productId: ufinityProductId = '',
        rentalPeriod,
        rentalUnit
      } = {}
    } = {}
  ] = nonEmptyProducts?.length === 1 ? nonEmptyProducts : [];

  // purchase button text
  const svodRentText = detailRentButtonText
    .replace(detailPriceRegex, priceFinal)
    .replace(detailPeriodRegex, denomination);
  const tvodBuyText = detailBuyButtonText
    .replace(detailPriceRegex, priceFinal)
    .replace(detailPeriodRegex, `${rentalPeriod} ${rentalUnit}`);
  const singlePackPurchaseText = paymentRecurring ? svodRentText : tvodBuyText;

  const packPurchaseButtonText =
    nonEmptyProducts?.length > 1
      ? detailViewSubsPackBtn
      : singlePackPurchaseText;
  const purchaseButtonText = nonEmptyProducts?.length
    ? packPurchaseButtonText
    : '';

  // purchase button cta
  const redirectToMultiPacks = () =>
    history.push(`${MULTI_PACKS}/${contentId}`);

  const [beginPurchase, purchaseData] = usePurchaseMutation();
  const { redirectToLogin, isLoggedIn } = useRedirectToLogin();
  const onClickPurchase = (_, isValid) => {
    if (!isLoggedIn) {
      redirectToLogin();

      return;
    }
    if (purchaseData.loading) {
      return;
    }
    if (isParentalPinEnabled && !isParentalPinValid && !isValid) {
      setParentalPinCheck(isParentalPinEnabled);

      return;
    }

    beginPurchase({
      variables: {
        nagraProductId,
        ufinityProductId,
        assetId: contentId
      }
    });
  };

  useEffect(() => {
    const {
      data: { purchase: { code, paymentUrl } = {} } = {},
      error
    } = purchaseData;
    const isSuccess = code === paymentOk && !error;

    if (isSuccess) {
      if (paymentUrl && __CLIENT__) {
        window.location = paymentUrl;

        return;
      }
    }

    if (code || error) {
      setShowModal(true);
      setModalProps(
        purchaseModalProps({
          error,
          isSuccess,
          messages,
          purchasedContent: displayText
        })
      );
      fetchEntitlement({
        context: {
          headers: createHeaders({
            nagraToken
          })
        }
      });
    }
  }, [purchaseData]);

  const purchaseButtonCta =
    nonEmptyProducts?.length > 1 ? redirectToMultiPacks : onClickPurchase;

  return {
    modalProps,
    purchaseButtonText,
    purchaseButtonCta,
    purchaseData,
    setShowModal,
    showModal,
    toggleModal,
    assetRating
  };
};

export const isAssetHelper = pageType => pageType !== PACK_DETAILS;

export const sortEpisodesHelper = episodes => {
  const sortedEpisodes = (episodes || []).sort((episodeA, episodeB) => {
    const { episodeNumber: episodeNumberA, seasonNumber: seasonNumberA } =
      episodeA || {};
    const { episodeNumber: episodeNumberB, seasonNumber: seasonNumberB } =
      episodeB || {};

    return seasonNumberA - seasonNumberB || episodeNumberA - episodeNumberB;
  });

  return sortedEpisodes;
};
