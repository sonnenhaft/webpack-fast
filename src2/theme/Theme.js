import React, { useContext } from 'react';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';
import { ThemeProvider as ThemrThemeProvider } from 'react-css-themr';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import darkThemr from '#/theme/themes/dark';
import lightThemr from '#/theme/themes/light';
import { ThemeDefaults, AccedoOneTheme } from '#/config/templates';

import { ConfigContext } from '#/utils/context';

const themeNameToThemr = {
  dark: darkThemr,
  light: lightThemr
};

const ThemeContext = React.createContext();
const { Consumer: ContextConsumer, Provider: ContextProvider } = ThemeContext;

const DARK = 'dark';

const withTheme = Comp => {
  return props => {
    return (
      <ContextConsumer>
        {themeValue => {
          return <Comp {...props} theme={themeValue} />;
        }}
      </ContextConsumer>
    );
  };
};

const ThemeProvider = React.memo(
  ({ children }) => {
    const { theme: themeFromAccedoOne } = useContext(ConfigContext) || {};
    const theme =
      typeof themeFromAccedoOne === 'object'
        ? { ...ThemeDefaults, ...themeFromAccedoOne }
        : ThemeDefaults;
    let hasLoggedThemeWarning = false;

    if (
      themeFromAccedoOne?.name &&
      !AccedoOneTheme[(themeFromAccedoOne?.name)] &&
      !hasLoggedThemeWarning
    ) {
      console.warn(
        `Unexpected value of Accedo One Theme: "${themeFromAccedoOne.name}"`
      );

      hasLoggedThemeWarning = true;
    }

    const muiTheme = theme?.name === DARK ? darkBaseTheme : lightBaseTheme;

    return (
      <ContextProvider value={theme}>
        <ThemrThemeProvider theme={themeNameToThemr[DARK]}>
          <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
            {children}
          </MuiThemeProvider>
        </ThemrThemeProvider>
      </ContextProvider>
    );
  },
  (prevProps, nextProps) => {
    const { children: prevChildren, ...prevPropsParsed } = prevProps;
    const { children: nextChildren, ...nextPropsParsed } = nextProps;

    return (
      prevChildren === nextChildren && isEqual(prevPropsParsed, nextPropsParsed)
    );
  }
);

ThemeProvider.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.shape({
    name: PropTypes.string,
    titleColor: PropTypes.string
  })
};

export { ThemeProvider, withTheme };
