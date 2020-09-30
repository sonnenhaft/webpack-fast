import React from 'react';

import { BackIcon } from '#/components/Icons';
import { VJS_CUSTOM_CLASSNAMES } from '#/constants';

const { backButton } = VJS_CUSTOM_CLASSNAMES;

export const getPlayerBackButton = () => {
  return {
    className: backButton,
    iconSrc: <BackIcon className="vjs-custom-back-button-btn" />
    // button function is handled as onClick event of the Child Element of NagraPlayer in NagraPlayer.js
  };
};
