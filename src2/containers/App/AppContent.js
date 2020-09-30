import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import withConfig from '#/containers/utils/withConfig';
import Spinner from '#/components/Spinner/Spinner';
import StaticPage from '#/components/StaticPage/StaticPage';
import { ConfigProvider } from '#/utils/context';
import { withTheme } from '#/theme/Theme';
import { emptyJsonString, getParsedArray, getParsedObject } from '#/helpers';

import {
  DEFAULT_COPY_RIGHT,
  DEFAULT_MAX_RAIL_ITEMS,
  FALLBACK_MESSAGES,
  STATIC_PAGE_OPTIONS
} from '#/constants';

import styles from './app.scss';

// The entry point of your application. This is where
// you can control rendering based on received application
// status or configurations.

const parseItemCount = value => parseInt(value, 10) || DEFAULT_MAX_RAIL_ITEMS;

const AppContent = ({ children, config, loading, metadata = {} }) => {
  // If we haven't yet received an application status, we'll
  // simply return a spinner.
  // Can preferably be replaced with a SplashScreen component.

  const {
    appName,
    appSettingEntry,
    copyrightText = DEFAULT_COPY_RIGHT,
    epgCategories = [],
    faqUrl = '',
    languageMap = emptyJsonString,
    maximumTimeShiftHours,
    maxItemsInRail,
    r21EmailURL,
    messages = emptyJsonString,
    ratings,
    noPurchaseButtonText,
    ratingNameWeights,
    moreInformation = {},
    playerErrors = emptyJsonString,
    cdnErrors = emptyJsonString,
    preferredAudio = '',
    preferredSubtitle = '',
    privacyPolicyLink = '',
    signUpAndForgotCredentials = {},
    termsAndConditionLink = ''
  } = metadata || {};

  if (loading) {
    return <Spinner />;
  }

  const parsedMessages = getParsedObject(messages);
  const accedoOneMessages = {
    ...FALLBACK_MESSAGES,
    ...parsedMessages
  };
  const parsedPlayerErrors = getParsedObject(playerErrors);
  const parsedCdnErrors = getParsedObject(cdnErrors);
  const parsedRatingMap = getParsedObject(ratings);
  const ratingWeights = getParsedObject(ratingNameWeights);
  const parsedLanguageMap = getParsedObject(languageMap);
  const parsedAudioPref = getParsedArray(preferredAudio, ',');
  const parsedSubtitlesPref = getParsedArray(preferredSubtitle, ',');

  // If we're in maintenance mode, we'll display
  // the given message or fall back to a default one.
  const { maintenance } = appSettingEntry || {};
  if (maintenance) {
    return (
      <StaticPage
        messages={accedoOneMessages}
        type={STATIC_PAGE_OPTIONS.maintenance}
      />
    );
  }

  // We require the configuration to have been
  // provided before we render the actual app content.
  // If we don't have it yet we simply display the spinner.
  // Can preferably be replaced with a SplashScreen component.
  if (!config) {
    return <Spinner />;
  }

  // At this point we have both an active status and
  // a configuration object. Let's render the app!
  return (
    <div
      className={`${styles.root} ${styles[moreInformation.name]}`}
      id="root-view"
    >
      <ConfigProvider
        value={{
          appName,
          copyrightText,
          epgCategories,
          faqUrl,
          r21EmailURL,
          signUpAndForgotCredentials,
          ratingWeights,
          noPurchaseButtonText,
          languageMap: parsedLanguageMap,
          maximumTimeShiftHours,
          maxItemsInRail: parseItemCount(maxItemsInRail),
          ratingCodeMap: parsedRatingMap,
          messages: accedoOneMessages,
          playerErrors: { ...parsedPlayerErrors, ...parsedCdnErrors },
          preferredAudio: parsedAudioPref,
          preferredSubtitle: parsedSubtitlesPref,
          privacyPolicyLink,
          termsAndConditionLink
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
};

AppContent.propTypes = {
  children: PropTypes.node,
  config: PropTypes.object,
  loading: PropTypes.bool,
  metadata: PropTypes.object
};

const enhance = compose(
  withTheme,
  withConfig
);

// Finally also make sure that the app configuration is requested
// for the AppEntry. This enables us to get e.g. Accedo One configs
// before we actually render any app content.
export default enhance(AppContent);
