import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ProfileIcon } from '#/components/Icons';
import SettingsDropDown from './SettingsDropDown';
import styles from './profileSection.scss';

const { settingsButton, settingsButtonHover } = styles;

const ProfileButton = ({ iconStyle, messages } = {}) => {
  const buttonRef = useRef(null);

  const hideDropDown = () => {
    const buttonClassList = buttonRef.current?.classList;

    if (buttonClassList) {
      buttonClassList.remove(settingsButtonHover);

      window.requestAnimationFrame(() =>
        buttonClassList.add(settingsButtonHover)
      );
    }
  };

  return (
    <div
      ref={buttonRef}
      className={classnames(settingsButton, settingsButtonHover)}
    >
      <ProfileIcon iconStyle={iconStyle} />
      <SettingsDropDown hideDropDown={hideDropDown} messages={messages} />
    </div>
  );
};

ProfileButton.propTypes = {
  iconStyle: PropTypes.string,
  messages: PropTypes.object
};

export default ProfileButton;
