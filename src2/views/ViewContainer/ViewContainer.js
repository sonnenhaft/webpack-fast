import React, { Fragment, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import HelmetComponent from '#/components/HelmetComponent/HelmetComponent';
import Header from '#/containers/Header/Header';
import PageFooter from '#/components/PageFooter/PageFooter';
import StaticPage from '#/components/StaticPage/StaticPage';
import ViewContainerWithPlayerContext from './ViewContainerWithPlayerContext';
import AndroidSmartAppBanner from '#/components/AndroidSmartAppBanner/AndroidSmartAppBanner';

import { ROUTE, STATIC_PAGE_OPTIONS } from '#/constants';
import { ConfigContext, EpgProvider } from '#/utils/context';
import { useMobileRedirectCheck } from '#/helpers/useMobileRedirectCheck';
import styles from '../views.scss';

const specialRoutes = [ROUTE.SEARCH, ROUTE.LOGIN];

// https://reacttraining.com/react-router/web/guides/scroll-restoration

const { viewport, wrapper, pageFooter } = styles;
const useScrollOnLocationChange = location => {
  const ref = useRef('');
  useEffect(() => {
    if (
      ref.current &&
      location.pathname !== ref.current &&
      typeof document !== 'undefined'
    ) {
      // Currently the page scroll is in the root div
      const el = document.getElementById('root-view');
      if (el) {
        // scrollTo doesn't work on MS Edge: VDK-144
        el.scrollTop = 0;
      }
    }

    ref.current = location.pathname;
  });
};

const ViewContainer = ({ history = {}, route = {}, location = {} }) => {
  const isMobileRedirectShown = useMobileRedirectCheck(location);
  const { epgCategories, messages } = useContext(ConfigContext);

  useScrollOnLocationChange(location);

  const { pathname } = location;

  const isFullScreen = specialRoutes.includes(pathname);
  const isEpgRoute = pathname === ROUTE.GUIDE || pathname === ROUTE.EPG;

  const containerProps = {
    history,
    messages,
    isSpecialRoute: isFullScreen,
    route
  };

  return (
    <div className={viewport}>
      <HelmetComponent location={location} />
      <AndroidSmartAppBanner messages={messages} />
      <div className={wrapper}>
        {isMobileRedirectShown ? (
          <StaticPage
            messages={messages}
            type={STATIC_PAGE_OPTIONS.mobileRedirect}
          />
        ) : (
          <Fragment>
            {!isFullScreen && <Header />}
            {isEpgRoute ? (
              <EpgProvider>
                <ViewContainerWithPlayerContext
                  epgCategories={epgCategories}
                  {...containerProps}
                />
              </EpgProvider>
            ) : (
              <ViewContainerWithPlayerContext {...containerProps} />
            )}
            {!isFullScreen && <PageFooter className={pageFooter} />}
          </Fragment>
        )}
      </div>
    </div>
  );
};

ViewContainer.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  route: PropTypes.object
};

export default ViewContainer;
