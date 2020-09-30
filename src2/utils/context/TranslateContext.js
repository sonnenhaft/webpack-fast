import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookie';

import appConfig from '#/config/app';
import { TRANSLATE_COOKIE_NAME } from '#/constants';

const initialState = {
  selectedLanguage:
    cookie.load(TRANSLATE_COOKIE_NAME) || appConfig?.defaultLanguageSetting
};

const TranslateContext = React.createContext(initialState);

function TranslateProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialState.selectedLanguage
  );
  const saveSelectedLanguage = language => {
    setSelectedLanguage(language);
    cookie.save(TRANSLATE_COOKIE_NAME, language, { path: '/' });
  };

  return (
    <TranslateContext.Provider
      value={{ saveSelectedLanguage, selectedLanguage }}
    >
      {children}
    </TranslateContext.Provider>
  );
}

TranslateProvider.propTypes = {
  children: PropTypes.node
};

export { TranslateContext, TranslateProvider };
