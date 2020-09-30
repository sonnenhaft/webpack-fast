import React, { useContext } from 'react';

import { ConfigContext } from '#/utils/context';
import ProfileButton from './ProfileButton';
import SearchMenuButton from './SearchMenuButton';

import styles from './profileSection.scss';

const {
  headerProfileSection,
  searchButton,
  searchIconMenu,
  settingsIcon
} = styles;

const ProfileSearchSection = () => {
  const { messages } = useContext(ConfigContext);

  return (
    <div className={headerProfileSection}>
      <SearchMenuButton className={searchButton} iconStyle={searchIconMenu} />
      <ProfileButton iconStyle={settingsIcon} messages={messages} />
    </div>
  );
};

export default ProfileSearchSection;
