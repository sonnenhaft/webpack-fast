import React from 'react';
import PropTypes from 'prop-types';

import { useRetrieveAssetType } from '#/services/ovp/implementations/nagra';
import { isMobile } from '#/utils/getPlatform';
import { ASSET_TYPE, PURCHASE_STATUS, ROUTE } from '#/constants';

import { purchaseStatusText } from './pageRedirection.scss';

const { success } = PURCHASE_STATUS;
const { LINEAR_DETAILS, MOVIE_DETAILS, PACK_DETAILS } = ROUTE;
const { linear, pack, vod } = ASSET_TYPE;

const getRedirectedPath = assetType => {
  if (assetType) {
    switch (assetType) {
      case linear:
        return LINEAR_DETAILS;

      case pack:
        return PACK_DETAILS;

      case vod:
        return MOVIE_DETAILS;

      default:
        return null;
    }
  }
};

const PageRedirection = ({ history = {}, location = {} }) => {
  const { search } = location;
  const purchaseParams = search.slice(1).split('&');
  const purchaseParamsMap = purchaseParams.reduce((paramMap, param) => {
    const [key, value] = param.split('=');

    return {
      ...paramMap,
      [key]: value
    };
  }, {});
  const { id, product, status } = purchaseParamsMap || {};

  const { data: { idType } = {} } = useRetrieveAssetType(id);

  if (!isMobile() && idType) {
    history.push({
      pathname: `${getRedirectedPath(idType)?.slice(
        0,
        getRedirectedPath(idType)?.length - 3
      )}${id}`,
      state: {
        isPurchaseSuccess: status === success,
        purchasedContent: product
      }
    });

    return null;
  }

  return (
    <div>
      <p className={purchaseStatusText}>
        {status === success ? `${product} purchased.` : 'Purchase error.'}
      </p>
    </div>
  );
};

PageRedirection.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
};

export default PageRedirection;
