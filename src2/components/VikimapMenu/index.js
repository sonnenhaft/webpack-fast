import { themr as applyTheme } from 'react-css-themr';
import React from 'react';
import theme from './menu.scss';
import Menu from './Menu';
import MenuItemComponent from './MenuItem';

export const THEME_IDS = {
  Menu: 'VdkMenu',
  MenuItem: 'VdkMenuItem'
};

export const MenuItem_ = applyTheme(THEME_IDS.MenuItem)(MenuItemComponent);
export const MenuItem = applyTheme(THEME_IDS.MenuItem, theme)(
  MenuItemComponent
);

export const Menu_ = applyTheme(THEME_IDS.Menu)(props => (
  <Menu MenuItemObject={MenuItem_} {...props} />
));
export default applyTheme(THEME_IDS.Menu, theme)(props => (
  <Menu MenuItemObject={MenuItem} {...props} />
));
