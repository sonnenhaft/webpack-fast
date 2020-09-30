import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react';
import PropTypes from 'prop-types';

import { ConfigContext } from '#/utils/context';
import { Checkbox } from '#/components/Input';

import Subsection from '#/components/SubSection/SubSection';
import { TextButton } from '#/components/Button';

import { useToggleParentalSetting } from '#/services/settings';
import { PARENTAL_SETTING_TYPE, ROUTE } from '#/constants';

import { noop } from '#/helpers';

import { SCREEN } from './constants';

import {
  checkboxSection,
  checkbox,
  parentalControlButton
} from './parental-control.scss';

const PIN_6 = 'parentalPin6Digits_web';
const ENABLE_PARENTAL_CONTROL = 'parentalEnable_web';
const CHANGE_PIN = 'parentalChangePin_web';
const REQUIRE_PIN = 'parentalPinPurchase_web';
const RESTRICT_BY_CHANNELS = 'parentalRestrictChannel';
const RESTRICT_BY_RATINGS = 'parentalRestrictContentRating';
const MANAGE = 'parentalManageButton';

const CheckboxSection = ({
  caption,
  checked,
  disabled = false,
  onChange = noop,
  checkboxId
}) => (
  <div className={checkboxSection}>
    <Checkbox
      disabled={disabled}
      caption={caption}
      className={checkbox}
      checked={checked}
      onChange={onChange}
      checkboxId={checkboxId}
      type="tick"
    />
  </div>
);

const RestrictSection = ({
  title,
  buttonText,
  disabled = false,
  onClick = noop
}) => (
  <Subsection title={title} noSubtitle disabled={disabled}>
    <TextButton text={buttonText} disabled={disabled} onClick={onClick} />
  </Subsection>
);

const ParentalSettings = ({
  parentalPinSettings = {},
  setScreen = noop,
  history = {},
  refetchSettings = noop
}) => {
  const {
    restrictInAppPurchasesByPin,
    isPinEnabled,
    restrictChannelsByPin,
    restrictContentByPin
  } = parentalPinSettings || {};

  const prevLoadingRef = useRef(null);

  const [requirePin = restrictInAppPurchasesByPin, setRequirePin] = useState(
    undefined
  );

  const [
    toggleEnableSetting,
    { loading: enableLoading }
  ] = useToggleParentalSetting({
    settingName: PARENTAL_SETTING_TYPE.PIN_ENABLED,
    currentValue: isPinEnabled
  });

  const [
    toggleRestrictChannelsByPin,
    { loading: restrictChannelsLoading }
  ] = useToggleParentalSetting({
    settingName: PARENTAL_SETTING_TYPE.RESTRICT_CHANNELS,
    currentValue: restrictChannelsByPin
  });

  const [
    toggleRestrictContentByPin,
    { loading: restrictContentLoading }
  ] = useToggleParentalSetting({
    settingName: PARENTAL_SETTING_TYPE.RESTRICT_CONTENT,
    currentValue: restrictContentByPin
  });
  const [
    togglePurchaseSetting,
    { loading: restrictPurchaseLoading }
  ] = useToggleParentalSetting({
    settingName: PARENTAL_SETTING_TYPE.RESTRICT_PURCHASE,
    currentValue: restrictInAppPurchasesByPin
  });

  const loading =
    enableLoading ||
    restrictContentLoading ||
    restrictChannelsLoading ||
    restrictPurchaseLoading;

  const { messages } = useContext(ConfigContext);

  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      refetchSettings();
    }

    prevLoadingRef.current = loading;
  }, [loading]);

  const enableControl = () => {
    if (!restrictContentByPin) {
      toggleRestrictContentByPin();
    }
    if (!restrictChannelsByPin) {
      toggleRestrictChannelsByPin();
    }

    toggleEnableSetting();
  };

  const disableControl = () => {
    toggleEnableSetting();
  };

  const toggleRequirePin = () => {
    setRequirePin(!requirePin);
    togglePurchaseSetting();
  };

  const getMessage = key => messages[key] || '';

  return (
    <Fragment>
      <Subsection noSeperator>
        <CheckboxSection
          disabled={loading}
          caption={getMessage(ENABLE_PARENTAL_CONTROL)}
          checked={isPinEnabled}
          onChange={isPinEnabled ? disableControl : enableControl}
          checkboxId="parentalControlToggle"
        />
      </Subsection>
      <Subsection
        disabled={!isPinEnabled || loading}
        title={PIN_6}
        buttonText={CHANGE_PIN}
        buttonClassName={parentalControlButton}
        onClick={() =>
          setScreen({ screen: SCREEN.ENTER_PIN, nextRoute: SCREEN.CHANGE_PIN })
        }
      >
        <CheckboxSection
          disabled={!isPinEnabled || loading}
          caption={getMessage(REQUIRE_PIN)}
          checked={restrictInAppPurchasesByPin}
          onChange={toggleRequirePin}
          checkboxId="parentalPinForPurchaseToggle"
        />
      </Subsection>
      <RestrictSection
        disabled={!restrictChannelsByPin || !isPinEnabled || loading}
        title={RESTRICT_BY_CHANNELS}
        buttonText={getMessage(MANAGE)}
        onClick={() =>
          history?.push(ROUTE.RESTRICT_BY_CHANNELS, { isAuthenticated: true })
        }
      />
      <RestrictSection
        disabled={!restrictContentByPin || !isPinEnabled || loading}
        title={RESTRICT_BY_RATINGS}
        buttonText={getMessage(MANAGE)}
        onClick={() =>
          history?.push(ROUTE.RESTRICT_BY_RATINGS, { isAuthenticated: true })
        }
      />
      <Subsection noSubtitle />
    </Fragment>
  );
};

ParentalSettings.propTypes = {
  parentalPinSettings: PropTypes.object,
  setScreen: PropTypes.func,
  history: PropTypes.object,
  refetchSettings: PropTypes.func
};

RestrictSection.propTypes = {
  title: PropTypes.string,
  buttonText: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

CheckboxSection.propTypes = {
  caption: PropTypes.string,
  checked: PropTypes.bool,
  checkboxId: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
};

export default ParentalSettings;
