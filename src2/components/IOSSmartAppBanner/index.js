import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import {
  GET_SHORT_LINK,
  FIREBASE_KEY,
  PAGELINK,
  APP_ID_IOS,
  APP_ID_ANDROID,
  BUNDLE_ID_IOS
} from '#/constants';

const DEFAULT_CONTENT = `app-id=${APP_ID_IOS}`;
const getContent = data => {
  const { shortLink } = data || {};

  if (!shortLink) {
    return DEFAULT_CONTENT;
  }

  return `${DEFAULT_CONTENT}, app-argument=${shortLink}`;
};

const init = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

const getLongDynamicLink = () => {
  const link = window?.location?.href;

  if (!link) {
    return null;
  }

  const url = new URL(PAGELINK);
  url.searchParams.set('link', link);
  url.searchParams.set('apn', APP_ID_ANDROID);
  url.searchParams.set('ibi', BUNDLE_ID_IOS);

  return url.toString();
};

const getShortLink = async () => {
  const url = `${GET_SHORT_LINK}?key=${FIREBASE_KEY}`;
  const longDynamicLink = getLongDynamicLink();

  if (!longDynamicLink) {
    return;
  }

  try {
    const response = await fetch(url, {
      ...init,
      body: JSON.stringify({
        longDynamicLink
      })
    });

    if (!response.ok) {
      return;
    }

    return await response.json();
  } catch {
    // empty catch
  }
};

const IOSSmartAppBanner = () => {
  const [appArgument, setAppArgument] = useState('');

  useEffect(() => {
    let cancel = false;

    const doFetch = async () => {
      const response = await getShortLink();

      if (cancel) {
        return;
      }

      setAppArgument(response);
    };

    doFetch();

    return () => {
      cancel = true;
    };
  }, []);

  return (
    <Helmet>
      <meta name="apple-itunes-app" content={getContent(appArgument)} />
    </Helmet>
  );
};

export default IOSSmartAppBanner;
