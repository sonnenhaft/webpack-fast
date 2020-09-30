import React from 'react';

import { emptyJsonString } from '#/helpers';

import { DEFAULT_MAX_RAIL_ITEMS, DEFAULT_COPY_RIGHT } from '#/constants';

const initialConfig = {
  copyrightText: DEFAULT_COPY_RIGHT,
  epgCategories: [],
  faqUrl: '',
  languageMap: emptyJsonString,
  maxItemsInRail: DEFAULT_MAX_RAIL_ITEMS,
  messages: emptyJsonString,
  playerErrors: emptyJsonString,
  preferredAudio: '',
  preferredSubtitle: '',
  signUpAndForgotCredentials: {}
};

const ConfigContext = React.createContext(initialConfig);

const { Provider: ConfigProvider } = ConfigContext;

export { ConfigProvider, ConfigContext };
