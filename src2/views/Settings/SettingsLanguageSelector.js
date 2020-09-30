import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { useNonVikimapPages } from '#/services/accedoOne';
import {
  ConfigContext,
  TranslateContext,
  UserPrefContext
} from '#/utils/context';

import SettingsLanguageButton from './SettingsLanguageButton';
import SettingsLanguageOption from './SettingsLanguageOption';
import Spinner from '#/components/Spinner/Spinner';
import PageTitle from '#/components/PageTitle/PageTitle';

import { PREFERENCES_TYPE } from '#/constants';

import {
  preferencesBottomSection,
  preferencesContainer,
  preferencesDivider,
  preferencesTopSection
} from './settingsLanguageSelector.scss';

const PREFERENCES = 'Preferences';
const SHOW_INFO_LANGUAGE_PAGE_ID = 'more_lang';
const { audio, showInfo, subtitles } = PREFERENCES_TYPE;

const SettingsLanguageSelector = ({ messages = {} }) => {
  const { data: { accedoOne: { pages } = {} } = {}, loading } =
    useNonVikimapPages() || {};

  const {
    pageData: { filterListData: { valueData: languageList = [] } = {} } = {}
  } =
    pages?.find(({ pageData }) => {
      const { pageid } = pageData || {};

      return pageid === SHOW_INFO_LANGUAGE_PAGE_ID;
    }) || {};

  const {
    saveSelectedLanguage,
    selectedLanguage: selectedShowInfo
  } = useContext(TranslateContext);
  const { audioPref, saveAudioSubtitlesPref, subtitlesPref } = useContext(
    UserPrefContext
  );
  const {
    languageMap = {},
    preferredAudio: configPreferredAudio = [],
    preferredSubtitle: configPreferredSubtitle = []
  } = useContext(ConfigContext);
  const mapPreferredLanguageHelper = language => ({
    name: languageMap[language],
    value: language
  });
  const preferredAudio = configPreferredAudio.map(mapPreferredLanguageHelper);
  const preferredSubtitle = configPreferredSubtitle.map(
    mapPreferredLanguageHelper
  );

  const initialSettings = {
    [audio]: audioPref,
    [showInfo]: selectedShowInfo,
    [subtitles]: subtitlesPref,
    isModified: false
  };
  const [settings, setSettings] = useState(initialSettings);

  const {
    languageChangeMessage_web: languageChangeMessage,
    languageChangeMessageRegex,
    preferencesAudio,
    preferencesShowInfo,
    preferencesSubtitles,
    saveChangesText
  } = messages;
  const preferencesSelection = [
    { type: showInfo, text: preferencesShowInfo, languageList },
    { type: audio, text: preferencesAudio, languageList: preferredAudio },
    {
      type: subtitles,
      text: preferencesSubtitles,
      languageList: preferredSubtitle
    }
  ];

  const settingsLanguageOptions = preferencesSelection.map(preference => (
    <SettingsLanguageOption
      key={preference?.type}
      initialSettings={initialSettings}
      setSettings={setSettings}
      settings={settings}
      {...preference}
    />
  ));

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={preferencesContainer}>
      <div className={preferencesTopSection}>
        <PageTitle text={PREFERENCES} />
        <SettingsLanguageButton
          initialSettings={initialSettings}
          languageChangeMessage={languageChangeMessage}
          languageChangeMessageRegex={languageChangeMessageRegex}
          saveChangesText={saveChangesText}
          saveSelectedLanguage={saveSelectedLanguage}
          saveAudioSubtitlesPref={saveAudioSubtitlesPref}
          setSettings={setSettings}
          settings={settings}
        />
      </div>
      <div className={preferencesDivider} />
      <div className={preferencesBottomSection}>{settingsLanguageOptions}</div>
    </div>
  );
};

SettingsLanguageSelector.propTypes = {
  messages: PropTypes.object
};

export default SettingsLanguageSelector;
