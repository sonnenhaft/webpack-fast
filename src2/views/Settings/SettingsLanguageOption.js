import React from 'react';
import PropTypes from 'prop-types';

import HoverButtonMenu from '#/components/HoverButtonMenu/HoverButtonMenu';
import { Chevron } from '#/components/Icons';

import { noop } from '#/helpers';

import {
  chevronContainer,
  customChevron,
  customChevronPath,
  languageOptionContainer
} from './settingsLanguageSelector.scss';

const SettingsLanguageOption = ({
  languageList = [],
  initialSettings = {},
  setSettings = noop,
  settings = {},
  text,
  type
}) => {
  const selectionData = languageList.map(({ name }) => name);
  const { isModified } = settings;
  const { name } = (isModified ? settings : initialSettings)[type] || {};
  const selectedIndex = selectionData.indexOf(name);

  const hoverButtonIconStyle = {
    className: chevronContainer,
    iconClassName: customChevron,
    iconPathClassName: customChevronPath
  };

  const setSelection = index => {
    setSettings({
      ...settings,
      [type]: languageList[index],
      isModified: true
    });
  };

  return (
    <div className={languageOptionContainer}>
      <span>{text}</span>
      <HoverButtonMenu
        customIconStyle={hoverButtonIconStyle}
        displayText={selectionData[selectedIndex]}
        icon={Chevron}
        selectedIndex={selectedIndex}
        selectionData={selectionData}
        setSelectedIndex={setSelection}
      />
    </div>
  );
};

SettingsLanguageOption.propTypes = {
  initialSettings: PropTypes.object,
  languageList: PropTypes.array,
  setSettings: PropTypes.func,
  settings: PropTypes.object,
  text: PropTypes.string,
  type: PropTypes.string
};

export default SettingsLanguageOption;
