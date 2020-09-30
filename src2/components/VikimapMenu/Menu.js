import React from 'react';
import PropTypes from 'prop-types';
import MenuItemComponent from './MenuItem';

const MenuComponent = ({
  items,
  activeStyle,
  vertical = false,
  loaded = false,
  isCollapsible = false,
  isCollapsed = true,
  onMenuItemClick,
  onMenuItemHover,
  onMenuItemStoppedHover,
  theme,
  MenuItemObject
}) => {
  const renderItems = () => {
    return items.map((item, index) => (
      <MenuItemObject
        {...item}
        key={index}
        activeStyle={activeStyle}
        onMenuItemClick={onMenuItemClick}
        onMenuItemHover={onMenuItemHover}
        onMenuItemStoppedHover={onMenuItemStoppedHover}
        subItems={item.items || []}
        vertical={vertical}
      />
    ));
  };

  const classNames = [
    theme.menu,
    isCollapsible ? theme.collapsible : '',
    vertical ? theme.vertical : '',
    isCollapsible && !isCollapsed ? theme.expanded : ''
  ];

  return (
    <div className={classNames.join(' ')}>
      {loaded ? renderItems() : 'Loading...'}
    </div>
  );
};

MenuComponent.propTypes = {
  activeStyle: PropTypes.object,
  isCollapsed: PropTypes.bool,
  isCollapsible: PropTypes.bool,
  items: PropTypes.array,
  loaded: PropTypes.bool,
  MenuItemObject: PropTypes.func,
  onMenuItemClick: PropTypes.func,
  onMenuItemHover: PropTypes.func,
  onMenuItemStoppedHover: PropTypes.func,
  theme: PropTypes.shape({
    collapsible: PropTypes.string,
    expanded: PropTypes.string,
    menu: PropTypes.string,
    vertical: PropTypes.string
  }),
  vertical: PropTypes.bool
};

const Menu = props => (
  <MenuComponent MenuItemObject={MenuItemComponent} {...props} />
);

export default Menu;
export { Menu };
