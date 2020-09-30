import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  getDeviceType,
  getIosBrowser,
  isMobile,
  DEVICE_TYPE,
  PLATFORM
} from '#/utils/getPlatform';
import {
  ANDROID_CHROME_BANNER_LINK,
  IOS_CHROME_BANNER_LINK
} from '#/constants';

import styles from './androidSmartAppBanner.scss';

const { banner } = styles;

const getBannerLink = () => {
  if (isMobile()) {
    if (
      getDeviceType() === DEVICE_TYPE.ios &&
      getIosBrowser() === PLATFORM.chrome
    ) {
      return IOS_CHROME_BANNER_LINK;
    }

    if (getDeviceType() === DEVICE_TYPE.chrome) {
      return ANDROID_CHROME_BANNER_LINK;
    }
  }
};

const AndroidSmartAppBanner = ({ messages = {} }) => {
  const { mobileAppBanner } = messages;
  const bannerLink = getBannerLink();

  return (
    <Fragment>
      {bannerLink && (
        <a className={banner} href={bannerLink}>
          {mobileAppBanner}
        </a>
      )}
    </Fragment>
  );
};

AndroidSmartAppBanner.propTypes = {
  messages: PropTypes.object
};

export default AndroidSmartAppBanner;
