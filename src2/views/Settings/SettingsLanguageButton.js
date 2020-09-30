import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import Button from '#/components/Button/Button';
import Modal from '#/components/Modal/Modal';

import {
  PREFERENCES_TYPE,
  SETTINGS_LANGUAGE_CHANGE_DONE,
  SETTINGS_LANGUAGE_SUCCESS_ICON,
  SETTINGS_LANGUAGE_TITLE
} from '#/constants';
import { noop } from '#/helpers';

import { languageOptionSaveBtn } from './settingsLanguageSelector.scss';

const { audio, showInfo, subtitles } = PREFERENCES_TYPE;

const SettingsLanguageButton = ({
  initialSettings = {},
  saveChangesText,
  saveSelectedLanguage = noop,
  saveAudioSubtitlesPref = noop,
  setSettings = noop,
  settings = {}
}) => {
  const [isSettingsEqual, setIsSettingsEqual] = useState(false);
  const { isModified } = settings;

  useEffect(() => {
    const compareSettings = isEqual(initialSettings, settings);
    setIsSettingsEqual(compareSettings);
  }, [settings]);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const saveButtonCallback = () => {
    saveSelectedLanguage(settings[showInfo]);
    saveAudioSubtitlesPref({
      [audio]: settings[audio],
      [subtitles]: settings[subtitles]
    });
    setSettings({
      ...settings,
      isModified: false
    });
    setShowModal(true);
  };

  const buttonProps = [
    {
      onClick: toggleModal,
      displayText: SETTINGS_LANGUAGE_CHANGE_DONE
    }
  ];

  return (
    <div>
      <Button
        white
        className={languageOptionSaveBtn}
        disabled={isSettingsEqual || !isModified}
        displayText={saveChangesText}
        onClick={saveButtonCallback}
      />
      <Modal
        buttonProps={buttonProps}
        iconType={SETTINGS_LANGUAGE_SUCCESS_ICON}
        showModal={showModal}
        title={SETTINGS_LANGUAGE_TITLE}
        toggleModal={toggleModal}
      />
    </div>
  );
};

SettingsLanguageButton.propTypes = {
  initialSettings: PropTypes.object,
  saveChangesText: PropTypes.string,
  saveSelectedLanguage: PropTypes.func,
  saveAudioSubtitlesPref: PropTypes.func,
  setSettings: PropTypes.func,
  settings: PropTypes.object
};

export default SettingsLanguageButton;
