import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import config from '#/config';
import AppContent from '#/containers/App/AppContent';
import IOSSmartAppBanner from '#/components/IOSSmartAppBanner';
import { useAccedoOneConfig } from '#/services/accedoOne';

/**
 * import injectTapEventPlugin from 'react-tap-event-plugin';
 * injectTapEventPlugin(); //@todo add back when require('react-dom') could get ^16.0.0
 */

const { title, titleTemplate, meta } = config.app.head;

// An application shell for listening to mount
// events and trigger appropriate lifecycle
// actions for your app. These would typically
// be used for analytics and similar.
const AppShell = props => {
  const { data: { accedoOne } = {}, loading } = useAccedoOneConfig();
  const usedTitle = accedoOne?.appName || title;

  return (
    <>
      <Helmet
        defaultTitle={usedTitle}
        titleTemplate={titleTemplate}
        meta={meta}
      />
      <IOSSmartAppBanner />
      <AppContent metadata={accedoOne} loading={loading} {...props} />
    </>
  );
};

AppShell.propTypes = {
  metadata: PropTypes.object
};

export default AppShell;
