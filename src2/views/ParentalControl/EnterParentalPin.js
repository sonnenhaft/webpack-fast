import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import _isBoolean from 'lodash/isBoolean';

import { noop } from '#/helpers';
import SubSection from '#/components/SubSection/SubSection';
import { TextButton } from '#/components/Button';
import { useParentalPinValid, useHasEmail } from '#/services/settings';

import {
  ENTER_PIN_TO_WATCH,
  CONFIRM,
  INCORRECT_PIN,
  TRY_AGAIN,
  TRY_AGAIN_OR_REQUEST,
  FORGOT_PIN,
  SCREEN
} from './constants';

import { pinInputContainer, textButton } from './parental-control.scss';

const EnterParentalPin = ({
  getMessage = noop,
  setScreen = noop,
  screenData = {},
  setModalProps = noop,
  toggleModal = noop
}) => {
  const emailLoadingRef = useRef(null);
  const [pin, setPin] = useState('');
  const { nextRoute } = screenData || {};
  const clearPin = () => setPin('');
  const [checkHasEmail, { data, loading: emailLoading }] = useHasEmail();

  const [
    checkPin,
    { data: { parentalPin: { isValid } = {} } = {} }
  ] = useParentalPinValid();

  const verifyPin = () => {
    checkPin({ variables: { currentPin: pin } });
  };

  useEffect(() => {
    const { settings: { hasEmail } = {} } = data || {};

    if (emailLoadingRef.current && !emailLoading) {
      setScreen({
        screen: hasEmail ? SCREEN.SET_PIN_RESET_EMAIL : SCREEN.UPDATE_EMAIL
      });
    }

    emailLoadingRef.current = emailLoading;
  }, [emailLoading]);

  useEffect(() => {
    if (_isBoolean(isValid)) {
      if (isValid) {
        const isChangePinFlow = nextRoute === SCREEN.CHANGE_PIN;

        setScreen({
          ...(isChangePinFlow && { currentPin: pin }),
          screen: nextRoute || SCREEN.SETTINGS
        });

        return;
      }

      setModalProps({
        buttonProps: [
          {
            displayText: TRY_AGAIN,
            onClick: clearPin
          }
        ],
        title: INCORRECT_PIN,
        subtitle: TRY_AGAIN_OR_REQUEST,
        iconType: 'warning',
        onModalClose: clearPin
      });
      toggleModal();
    }
  }, [isValid]);

  const subProps = {
    title: ENTER_PIN_TO_WATCH,
    buttonText: CONFIRM,
    buttonType: 'light',
    buttonDisabled: pin.length < 6,
    onClick: verifyPin,
    pinInputProps: [
      {
        masked: true,
        pin,
        onChange: setPin,
        className: pinInputContainer
      }
    ]
  };

  return (
    <SubSection {...subProps}>
      <TextButton
        className={textButton}
        text={getMessage(FORGOT_PIN)}
        onClick={checkHasEmail}
      />
    </SubSection>
  );
};

EnterParentalPin.propTypes = {
  getMessage: PropTypes.func,
  setScreen: PropTypes.func,
  setModalProps: PropTypes.func,
  toggleModal: PropTypes.func,
  screenData: PropTypes.object
};

export default EnterParentalPin;
