import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { isMobile } from '#/utils/getPlatform';
import { withTheme } from '#/theme/Theme';
import logo from '#/static/images/logo@3x.png';

import HeaderMenu from '../HeaderMenu/HeaderMenu';

import styles from './header.scss';

export const Header = ({
  VikimapMenu,
  config,
  isCollapsed,
  onMenuCollapse,
  onMenuToggle,
  theme = {}
}) => {
  const { accedoOne = {} } = config;
  const usedAppLogo = accedoOne.assets?.appLogo || logo;

  return (
    <div className={`${styles.appBar} ${styles[theme.name]}`}>
      <Link to="/" className={styles.logoLink}>
        <img src={usedAppLogo} className={styles.logo} alt="app logo" />
      </Link>
      {accedoOne && !isMobile() ? (
        <HeaderMenu
          menuId={accedoOne.mainMenuEntryId}
          isCollapsed={isCollapsed}
          onMenuToggle={onMenuToggle}
          onMenuCollapse={onMenuCollapse}
          VikimapMenu={VikimapMenu}
        />
      ) : (
        ''
      )}
    </div>
  );
};

Header.propTypes = {
  VikimapMenu: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    .isRequired,
  config: PropTypes.object,
  isCollapsed: PropTypes.bool,
  onMenuCollapse: PropTypes.func,
  onMenuToggle: PropTypes.func,
  theme: PropTypes.object
};

Header.defaultProps = {
  config: {}
};

export default withTheme(Header);
