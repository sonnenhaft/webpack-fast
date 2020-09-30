import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '#/components/Spinner/Spinner';

import {
  validateAreValuesDefined,
  validateContainsAllKeys
} from '#/utils/validations';
import { AccedoOnePageTemplateMap } from '#/config/templates';
import { useVikimapQuery } from '#/services/vikimap';
import { useEntitlement } from '#/services/auth';
import NoMatch from '#/views/NoMatch/NoMatch';
import { AuthContext } from '#/utils/context';

import FailedToLoad from '../FailedToLoad/FailedToLoad';
import ContainerPage from '../ContainerPage/ContainerPage';

import VikimapViewsIds from './VikimapViewsIds';

import { ROUTE } from '#/constants';
import { useDestructureFromAuthContext } from '#/helpers/hooks';

const ViewIdToViewComponent = {
  [VikimapViewsIds.AccedoOneContainer]: ContainerPage,
  [VikimapViewsIds.Default]: ContainerPage
};

validateAreValuesDefined(ViewIdToViewComponent);
validateContainsAllKeys(ViewIdToViewComponent, VikimapViewsIds);

const { HOME, STORE } = ROUTE;
const routesToRefetchData = [HOME, STORE];

const VikimapPage = ({
  match: {
    params: { id },
    url = ''
  }
}) => {
  const pageId = id || url.slice(1);
  const [vikimapQuery, { called, data, error, loading } = {}] = useVikimapQuery(
    true
  );

  const { isLoggedIn, nagraToken } = useDestructureFromAuthContext(AuthContext);
  const { fetchEntitlement } = useEntitlement({
    nagraToken,
    refetch: true
  });
  const [vikimapData, setVikimapData] = useState(null);

  useEffect(() => {
    if (routesToRefetchData.includes(url)) {
      vikimapQuery();
      setVikimapData(data);
    }
  }, [pageId]);

  useEffect(() => {
    vikimapQuery();
    if (isLoggedIn) {
      fetchEntitlement();
    }
  }, []);

  // If the Vikimap entry failed to load, failedToLoad will
  // be true. Then we'll render a page to show the error info.
  if (!data?.accedoOne && !loading && called) {
    return <FailedToLoad debugInfo={error} />;
  }

  // If the page entry data hasn't been loaded yet
  // we'll simply display a spinner.
  if (loading) {
    return <Spinner />;
  }

  // If we get to this point, we know that we have
  // the Vikimap page data. I.e. we have access
  // to the 'displayText', 'template' and 'containers'.
  //
  // We'll use the 'template'value to figure out
  // which type of page to render.
  const { accedoOne: { menu: { items } = {} } = {} } =
    vikimapData || data || {};
  // TODO Query page data with ID to return page specific data
  const { pageData } =
    items?.find(
      ({
        pageData: { _meta: { entryAlias } = {}, pageid, subMenuItems = [] } = {}
      }) =>
        pageid === pageId ||
        entryAlias === pageId ||
        subMenuItems?.find(
          ({ pageid: subMenuPageId }) => subMenuPageId === pageId
        )
    ) || {};

  const { subMenuItems } = pageData || {};
  const subMenuPageData = subMenuItems?.find(({ pageid }) => pageid === pageId);
  const viewId = AccedoOnePageTemplateMap[id] || VikimapViewsIds.Default;
  const TemplatePage = pageData?.templateComp || ViewIdToViewComponent[viewId];
  const templateData = subMenuPageData || pageData;

  if (!templateData) {
    return <NoMatch />;
  }

  return <TemplatePage {...templateData} />;
};

VikimapPage.propTypes = {
  containers: PropTypes.array,
  dispatch: PropTypes.func,
  displayText: PropTypes.string,
  entry: PropTypes.object,
  entryId: PropTypes.string,
  errorMessage: PropTypes.string,
  failedToLoad: PropTypes.bool,
  loaded: PropTypes.bool,
  match: PropTypes.object,
  template: PropTypes.string,
  templateComp: PropTypes.func
};

export default VikimapPage;
