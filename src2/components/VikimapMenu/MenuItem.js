/** Changes to default VDK Menu
 *
 * Add disabled menu item className to menuItemContainer
 * Remove CSS styles which are overridden
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

const MenuItem = ({
  displayText,
  subText = '',
  to = '',
  vertical = false,
  icon,
  theme,
  subItems,
  onMenuItemClick,
  onMenuItemHover,
  onMenuItemStoppedHover,
  isDisabled
}) => {
  const renderSubItems = () => {
    return subItems.map((sub, index) => {
      return (
        <NavLink
          key={index}
          activeClassName={theme.menuSubItemActive}
          className={theme.menuSubItem}
          id={`menuitem_${index}`}
          onClick={onMenuItemClick}
          to={sub.to}
        >
          <span>{sub.displayText}</span>
        </NavLink>
      );
    });
  };

  const handleMouseEnter = () => {
    onMenuItemHover?.(to);
  };

  const handleMouseLeave = () => {
    onMenuItemStoppedHover?.(to);
  };

  const menuItemContainerClass = classNames(theme.menuItemContainer, {
    [theme.hasSubItems]: subItems && subItems.length,
    [theme.vertical]: vertical,
    [theme.disabledMenuItem]: isDisabled
  });

  return (
    <div
      className={menuItemContainerClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        activeClassName={theme.menuItemActive}
        className={theme.menuItem}
        onClick={onMenuItemClick}
        to={to}
      >
        {icon ? (
          <img alt="menu icon" className={theme.menuItemIcon} src={icon} />
        ) : null}
        <span className={theme.menuItemText}>{displayText}</span>
        {subText ? (
          <span className={theme.menuItemSubText}>{subText}</span>
        ) : null}
      </NavLink>
      {subItems?.length ? (
        <div className={theme.subItemsContainer}>{renderSubItems()}</div>
      ) : null}
    </div>
  );
};

MenuItem.propTypes = {
  displayText: PropTypes.string,
  icon: PropTypes.string,
  isDisabled: PropTypes.bool,
  onMenuItemClick: PropTypes.func,
  onMenuItemHover: PropTypes.func,
  onMenuItemStoppedHover: PropTypes.func,
  subItems: PropTypes.arrayOf(
    PropTypes.shape({
      displayText: PropTypes.string,
      to: PropTypes.any
    })
  ),
  subText: PropTypes.string,
  theme: PropTypes.shape({
    hasSubItems: PropTypes.string,
    menuItem: PropTypes.string,
    menuItemActive: PropTypes.string,
    menuItemContainer: PropTypes.string,
    menuSubItem: PropTypes.string,
    subItemsContainer: PropTypes.string,
    vertical: PropTypes.string
  }),
  to: PropTypes.string,
  vertical: PropTypes.bool
};

export default MenuItem;
