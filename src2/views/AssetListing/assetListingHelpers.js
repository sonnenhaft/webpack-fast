import { useEffect } from 'react';
import {
  useRetrieveDetailsListingData,
  useRetrieveListingLazyQUery,
  useRetrieveListingData
} from '#/services/ovp/implementations/nagra';
import {
  usePackDetails,
  usePurchaseMutation,
  useRedirectToLogin
} from '#/services/purchase';
import { useEntitlement } from '#/services/auth';

import { AuthContext } from '#/utils/context';
import { purchaseModalProps } from './utils/constants';

import { createHeaders } from '#/helpers';
import { PAYMENT_CODES, ROUTE } from '#/constants';
import { useDestructureFromAuthContext } from '#/helpers/hooks';

const { ASSET_LISTING, DETAILS_LISTING, PACKS_LISTING } = ROUTE;
const { paymentOk } = PAYMENT_CODES;

export const getAssetListing = ({
  assetListingId,
  path,
  authenticatedListing = []
}) => {
  const { fetchEntitlement } = useEntitlement();
  const { isLoggedIn, nagraToken } = useDestructureFromAuthContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      fetchEntitlement({
        context: {
          headers: createHeaders({
            nagraToken
          })
        }
      });
    }
  }, []);

  switch (path) {
    case ASSET_LISTING: {
      const isAuthenticatedQuery = authenticatedListing.includes(
        assetListingId
      );
      const { data, loading } = useRetrieveListingData({
        id: assetListingId,
        isAuthenticatedQuery
      });

      return { data, loading };
    }

    case DETAILS_LISTING: {
      const { data, loading } = useRetrieveDetailsListingData(assetListingId);

      return { data, loading };
    }

    case PACKS_LISTING: {
      const [
        packDetailsQuery,
        {
          data: {
            packDetails: {
              whatsInsideCTAParam: packAssetListingId,
              ...purchaseInfo
            } = {}
          } = {}
        }
      ] = usePackDetails({ packId: assetListingId, isLoggedIn });
      const [getListing, { data, loading }] = useRetrieveListingLazyQUery(
        packAssetListingId
      );

      useEffect(() => {
        packDetailsQuery();
      }, []);

      useEffect(() => {
        if (packAssetListingId) {
          getListing();
        }
      }, [packAssetListingId]);

      return { data, loading, purchaseInfo };
    }

    default:
      return {};
  }
};

export const purchaseHelper = ({
  messages,
  purchasedContent,
  setModalProps,
  setPurchasedContent,
  setShowModal
}) => {
  const [beginPurchase, purchaseData] = usePurchaseMutation();
  const { redirectToLogin, isLoggedIn } = useRedirectToLogin();
  const { fetchEntitlement } = useEntitlement();
  const { nagraToken } = useDestructureFromAuthContext(AuthContext);

  const onClickPurchase = ({
    displayText,
    nagraProductId,
    ufinityProductId
  }) => {
    if (!isLoggedIn) {
      redirectToLogin();

      return;
    }
    if (!purchaseData.loading) {
      beginPurchase({
        variables: {
          nagraProductId,
          ufinityProductId
        }
      });
      setPurchasedContent(displayText);
    }
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
        purchaseModalProps({ isSuccess, messages, purchasedContent, error })
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

  return { onClickPurchase, purchaseDisabled: purchaseData.loading };
};
