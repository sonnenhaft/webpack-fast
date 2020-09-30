import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useLoadingComplete } from '#/utils/hooks';
import { useIsPinValid } from '#/services/r21Pin';
import { noop } from '#/helpers';
import SubSection from '#/components/SubSection/SubSection';

import { dobButton } from './r21-pin.scss';

import {
  ENTER_CURRENT_PIN_TITLE,
  PIN_INPUT_ERROR,
  CONFIRM,
  ENTER_R21_PIN,
  TRY_AGAIN,
  PLEASE_TRY_AGAIN,
  REQUEST_NEW_PIN,
  SCREEN
} from './utils/constants';

const EnterR21Pin = ({
  setModalProps = noop,
  toggleModal = noop,
  setScreen = noop
}) => {
  const [pin, setPin] = useState('');

  const clearPin = () => setPin('');

  const [
    checkIsValid,
    { data: { r21Pin: { isValid } = {} } = {}, loading }
  ] = useIsPinValid({
    withRefreshLoading: false
  });

  const subProps = {
    title: ENTER_CURRENT_PIN_TITLE,
    buttonText: CONFIRM,
    buttonClassName: dobButton,
    buttonType: 'light',
    buttonDisabled: pin.length < 6,
    onClick: () => {
      checkIsValid({ variables: { currentPin: pin } });
    },
    pinInputProps: [
      { masked: true, pin, onChange: setPin, errorMessage: PIN_INPUT_ERROR }
    ]
  };

  useLoadingComplete({
    loading,
    onComplete: () => {
      if (isValid) {
        const currentPin = pin;

        clearPin();
        setScreen({ screen: SCREEN.CHANGE_R21_PIN, currentPin });

        return;
      }

      const buttonProps = [
        {
          displayText: REQUEST_NEW_PIN,
          onClick: () =>
            setScreen({
              screen: SCREEN.SET_R21_PIN,
              sectionTitle: ENTER_R21_PIN
            })
        },
        {
          displayText: TRY_AGAIN,
          onClick: clearPin
        }
      ];

      setModalProps({
        buttonProps,
        title: 'Incorrect R21 PIN',
        subtitle: PLEASE_TRY_AGAIN,
        iconType: 'warning',
        onModalClose: clearPin
      });

      toggleModal();
    }
  });

  return <SubSection {...subProps} />;
};

EnterR21Pin.propTypes = {
  setModalProps: PropTypes.func,
  setScreen: PropTypes.func,
  toggleModal: PropTypes.func
};

export default EnterR21Pin;
