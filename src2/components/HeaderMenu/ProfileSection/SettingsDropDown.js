import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import LoginButton from '#/views/LoginPage/LoginButton';
import { useLogout } from '#/services/graphql/refreshHooks';

import { noop } from '#/helpers';

import { AUTH_ACTIONS, LOGOUT_TYPE, MENU, ROUTE } from '#/constants';

import { AuthContext, ConfigContext, TranslateContext } from '#/utils/context';

import styles from './profileSection.scss';
import ExternalLink from '#/components/ExternalLink/ExternalLink';

import { useOAuthLogout } from '#/views/LoginPage/useOauthUfinityModal';

const {
  R21_PIN,
  HOME,
  SETTINGS_LANG,
  VOUCHER,
  DEVICE_MANAGEMENT,
  TRANSACTIONS,
  PARENTAL_CONTROLS
} = ROUTE;

const routeMap = {
  [MENU.CHANGE_R21_PIN]: R21_PIN,
  [MENU.REDEEM_VOUCHER]: VOUCHER,
  [MENU.DEVICES_MANAGEMENT]: DEVICE_MANAGEMENT,
  [MENU.MY_TRANSACTIONS]: TRANSACTIONS,
  [MENU.PARENTAL_CONTROLS]: PARENTAL_CONTROLS
};

const mockDisplayNames = [
  MENU.CHANGE_R21_PIN,
  MENU.DEVICES_MANAGEMENT,
  MENU.MY_TRANSACTIONS,
  MENU.REDEEM_VOUCHER,
  MENU.PARENTAL_CONTROLS
];

const { userAction } = LOGOUT_TYPE;

const baseMockItems = mockDisplayNames.map(displayText => ({
  displayText,
  ...(routeMap[displayText] && { to: routeMap[displayText] || HOME }),
  isProtected: true
}));

const SettingsDropDownButton = ({
  displayText = '',
  onClick = noop,
  hideDropDown = noop
}) => {
  const onButtonClick = () => {
    onClick();
    hideDropDown();
  };

  return (
    <div className={styles.settingsMenuItem} onClick={onButtonClick}>
      {displayText}
    </div>
  );
};

const SettingsDropDownItem = ({
  displayText,
  to,
  hideDropDown,
  isExternalLink,
  isLoggedIn,
  isProtected
}) => {
  if (!isLoggedIn && isProtected) {
    return null;
  }

  if (isExternalLink || !to) {
    return (
      <ExternalLink
        className={styles.settingsMenuItem}
        displayText={displayText}
        href={to}
      />
    );
  }

  return (
    <Link className={styles.settingsMenuItem} to={to} onClick={hideDropDown}>
      {displayText}
    </Link>
  );
};

const SettingsDropDown = ({
  dropDownItems,
  hideDropDown = noop,
  messages = {}
}) => {
  const { state, dispatch } = useContext(AuthContext) || {};
  const [goToLogin, setGoToLogin] = useState(false);
  const { selectedLanguage: { name } = {} } = useContext(TranslateContext);
  const { faqUrl } = useContext(ConfigContext);

  const {
    isLoggedIn,
    ufinity: { token: ufinityAccessToken },
    nagra: { token: nagraAccessToken }
  } = state || {};

  const [logout] = useLogout({
    ufinityAccessToken,
    nagraAccessToken
  });

  const { getOauthLogoutUrl } = useOAuthLogout();
  const [isReadyLogout, setIsReadyLogout] = useState(false);

  const onLogoutPress = () => {
    logout({
      variables: {
        type: userAction,
        message: 'web - user logged out action'
      }
    });
    dispatch({ type: AUTH_ACTIONS.LOGOUT });

    setIsReadyLogout(true);
  };

  useEffect(() => {
    if (isReadyLogout) {
      getOauthLogoutUrl();
    }
  }, [isReadyLogout]);

  if (goToLogin) {
    return <Redirect to="/login?activated" />;
  }

  const {
    loginScreenTitle,
    showLanguageInfoText_web: showLanguageInfoText
  } = messages;

  const mockItems = {
    menuItems: [
      ...baseMockItems,
      {
        displayText: `${showLanguageInfoText}${name}`,
        to: SETTINGS_LANG
      },
      { displayText: MENU.HELP_FAQ, to: faqUrl, isExternalLink: true }
    ]
  };

  const { menuItems } = dropDownItems || mockItems;

  return (
    <div className={styles.settingsMenu}>
      {!isLoggedIn && (
        <div className={styles.settingsLoginButton}>
          {/* <LoginSection noPadding={true}/> */}
          <LoginButton
            onClick={() => setGoToLogin(true)}
            text={loginScreenTitle}
          />
        </div>
      )}
      {menuItems.map((itemProps, index) => (
        <SettingsDropDownItem
          key={`item-${index}`}
          hideDropDown={hideDropDown}
          isLoggedIn={isLoggedIn}
          {...itemProps}
        />
      ))}
      {isLoggedIn && (
        <SettingsDropDownButton
          displayText={MENU.LOGOUT}
          onClick={onLogoutPress}
          hideDropDown={hideDropDown}
        />
      )}
    </div>
  );
};

SettingsDropDownItem.propTypes = {
  displayText: PropTypes.string,
  hideDropDown: PropTypes.func,
  isExternalLink: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isProtected: PropTypes.bool,
  to: PropTypes.string
};

SettingsDropDownItem.defaultProps = {
  displayText: '',
  hideDropDown: noop,
  isExternalLink: false,
  isLoggedIn: true,
  isProtected: false
};

SettingsDropDownButton.propTypes = {
  displayText: PropTypes.string,
  hideDropDown: PropTypes.func,
  onClick: PropTypes.func
};

SettingsDropDown.propTypes = {
  hideDropDown: PropTypes.func,
  dropDownItems: PropTypes.arrayOf({
    displayText: PropTypes.string
  }),
  messages: PropTypes.object
};

export default SettingsDropDown;
