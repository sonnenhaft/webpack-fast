import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import localforage from 'localforage';

import appConfig from '#/config/app';
import { getStorageValue } from '#/helpers';
import { PREFERENCES_TYPE, USER_PREFERENCE } from '#/constants';

const { audio, subtitles } = PREFERENCES_TYPE;
const { defaultAudioCCSetting } = appConfig || {};

const initialState = {
  [audio]: defaultAudioCCSetting,
  [subtitles]: defaultAudioCCSetting,
  volume: 1
};

const UserPrefContext = React.createContext(initialState);

function UserPrefProvider({ children }) {
  const [audioPref, setAudioPref] = useState(initialState.audio);
  const [subtitlesPref, setSubtitlesPref] = useState(initialState.subtitles);
  const [volumePref, setVolumePref] = useState(initialState.volume);

  useEffect(() => {
    const getUserPreference = async () => {
      const userPreference = await getStorageValue(USER_PREFERENCE);

      const {
        audio: storedAudioPref,
        subtitles: storedSubtitlesPref,
        volume: storedVolumePref
      } = userPreference || {};
      setAudioPref(storedAudioPref || initialState.audio);
      setSubtitlesPref(storedSubtitlesPref || initialState.subtitles);
      setVolumePref(storedVolumePref || initialState.volume);
    };

    getUserPreference();
  }, []);

  const saveAudioSubtitlesPref = ({
    audio: newAudioPref,
    subtitles: newSubtitlesPref
  }) => {
    localforage.setItem(USER_PREFERENCE, {
      audio: newAudioPref,
      subtitles: newSubtitlesPref,
      volume: volumePref
    });
    setAudioPref(newAudioPref);
    setSubtitlesPref(newSubtitlesPref);
  };

  const saveVolumePref = volume => {
    localforage.setItem(USER_PREFERENCE, {
      audio: audioPref,
      subtitles: subtitlesPref,
      volume
    });
    setVolumePref(volume);
  };

  return (
    <UserPrefContext.Provider
      value={{
        audioPref,
        saveAudioSubtitlesPref,
        saveVolumePref,
        subtitlesPref
      }}
    >
      {children}
    </UserPrefContext.Provider>
  );
}

UserPrefProvider.propTypes = {
  children: PropTypes.node
};

export { UserPrefContext, UserPrefProvider };
