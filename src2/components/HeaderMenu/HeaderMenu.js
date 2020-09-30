import React from 'react';
import PropTypes from 'prop-types';
import { MenuToggle } from '@accedo/vdkweb-ui';

import { withTheme } from '#/theme/Theme';

import ProfileSection from './ProfileSection/ProfileSection';
import styles from './headerMenu.scss';

const { collapsed, expanded, container, menuContainer } = styles;

const HeaderMenu = ({
  VikimapMenu,
  isCollapsed,
  menuId,
  onMenuCollapse,
  onMenuToggle,
  theme
}) => {
  return (
    <span
      className={`${container} ${isCollapsed ? collapsed : expanded} ${
        styles[theme.name]
      }`}
    >
      <VikimapMenu
        id={menuId}
        isCollapsible
        isCollapsed={isCollapsed}
        onMenuItemClick={onMenuCollapse}
        theme={{ menu: menuContainer }}
      />
      <ProfileSection />
      <span className={styles.toggle}>
        <MenuToggle isCollapsed={isCollapsed} onMenuToggle={onMenuToggle} />
      </span>
    </span>
  );
};

HeaderMenu.propTypes = {
  VikimapMenu: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isCollapsed: PropTypes.bool,
  menuId: PropTypes.string,
  onMenuCollapse: PropTypes.func,
  onMenuToggle: PropTypes.func,
  theme: PropTypes.object
};

HeaderMenu.defaultProps = {
  isCollapsed: true
};

export default withTheme(HeaderMenu);
