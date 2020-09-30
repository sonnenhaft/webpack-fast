import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthContext, HistoryContext } from '#/utils/context';

import config from '#/config';
import ViewContainer from '#/views/ViewContainer/ViewContainer';
import {
  AssetListing,
  CommonDetailsPage,
  DeviceManagement,
  EpgPage,
  LoginPage,
  MultiPackListing,
  NoMatch,
  R21Pin,
  ToBeImplemented,
  Search,
  SettingsLanguageSelector,
  VikimapPage,
  VikimapDebugPage,
  Voucher,
  Transactions,
  PageRedirection,
  ParentalControl,
  RestrictByRatings,
  RestrictByChannels
} from '#/views';

import { ROUTE } from '#/constants';

const ProtectedComponent = ({
  Component,
  isLoginPage = false,
  route
}) => props => {
  const { state: { isLoggedIn } = {} } = useContext(AuthContext);
  const { pathname, setPathname } = useContext(HistoryContext);
  const prevRoute = pathname;

  if (!isLoggedIn && !isLoginPage) {
    setPathname(route);

    return <Redirect push to={ROUTE.HOME} />;
  }

  if (isLoggedIn && isLoginPage) {
    setPathname(ROUTE.HOME);

    return <Redirect to={prevRoute || ROUTE.HOME} />;
  }

  return <Component {...props} />;
};

const routes = [
  {
    component: ViewContainer,
    routes: [
      {
        path: ROUTE.ROOT,
        exact: true,
        component: () => <Redirect to={ROUTE.HOME} />
      },
      {
        path: ROUTE.MOVIE,
        component: CommonDetailsPage
      },
      {
        path: ROUTE.GUIDE,
        component: EpgPage
      },
      {
        path: ROUTE.EPG,
        component: EpgPage
      },
      {
        path: ROUTE.MOVIE_DETAILS,
        component: CommonDetailsPage
      },
      {
        path: ROUTE.LINEAR_DETAILS,
        component: CommonDetailsPage
      },
      {
        path: ROUTE.SERIES_DETAILS,
        component: CommonDetailsPage
      },
      {
        path: ROUTE.PACK_DETAILS,
        component: CommonDetailsPage
      },
      {
        path: ROUTE.CATEGORY,
        component: ToBeImplemented
      },
      {
        path: ROUTE.PARENTAL_CONTROLS,
        component: ProtectedComponent({
          Component: ParentalControl,
          route: ROUTE.PARENTAL_CONTROLS
        })
      },
      {
        path: ROUTE.RESTRICT_BY_RATINGS,
        component: ProtectedComponent({
          Component: RestrictByRatings,
          route: ROUTE.RESTRICT_BY_RATINGS
        })
      },
      {
        path: ROUTE.RESTRICT_BY_CHANNELS,
        component: ProtectedComponent({
          Component: RestrictByChannels,
          route: ROUTE.RESTRICT_BY_CHANNELS
        })
      },
      {
        path: ROUTE.LOGIN,
        component: ProtectedComponent({
          Component: LoginPage,
          isLoginPage: true
        })
      },
      {
        path: ROUTE.R21_PIN,
        component: ProtectedComponent({
          Component: R21Pin,
          route: ROUTE.R21_PIN
        })
      },
      {
        path: ROUTE.SEARCH,
        component: Search
      },
      {
        path: ROUTE.VOUCHER,
        component: ProtectedComponent({
          Component: Voucher,
          route: ROUTE.VOUCHER
        })
      },
      {
        path: ROUTE.SETTINGS_LANG,
        component: SettingsLanguageSelector
      },
      {
        path: ROUTE.SETTINGS,
        component: ToBeImplemented
      },
      {
        path: ROUTE.DEVICE_MANAGEMENT,
        component: ProtectedComponent({
          Component: DeviceManagement,
          route: ROUTE.DEVICE_MANAGEMENT
        })
      },
      {
        path: ROUTE.TRANSACTIONS,
        component: ProtectedComponent({
          Component: Transactions,
          route: ROUTE.TRANSACTIONS
        })
      },
      {
        path: ROUTE.TV,
        component: VikimapPage
      },
      {
        path: ROUTE.ASSET_LISTING,
        component: AssetListing
      },
      {
        path: ROUTE.DETAILS_LISTING,
        component: AssetListing
      },
      {
        path: ROUTE.PACKS_LISTING,
        component: AssetListing
      },
      {
        path: ROUTE.MULTI_PACKS,
        component: MultiPackListing
      },
      {
        path: ROUTE.PURCHASE_COMPLETE,
        component: PageRedirection
      },
      {
        path: ROUTE.ID,
        component: config.app.vikimap.debugMode ? VikimapDebugPage : VikimapPage
      },
      {
        path: ROUTE.NO_MATCH,
        component: NoMatch
      }
    ]
  }
];

export default routes;
