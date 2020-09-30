import React from 'react';
import PropTypes from 'prop-types';

import SubSection from '#/components/SubSection/SubSection';
import { usePureState, useLoadingComplete } from '#/utils/hooks';
import { useChangeParentalPin } from '#/services/settings';

import { noop, comparePins } from '#/helpers';

import {
  CONFIRM_NEW_PIN,
  ENTER_NEW_PIN,
  CONFIRM,
  PIN_INPUT_ERROR,
  SCREEN,
  OK_I_GOT_IT,
  PIN_SETUP_SUCCESSFULLY,
  ERROR,
  SUCCESSFUL,
  PIN_CHANGE_FAILED
} from './constants';

const initialState = {
  pin: '',
  reEnteredPin: ''
};

const ChangeParentalPin = ({
  screenData,
  setScreen = noop,
  toggleModal = noop,
  setModalProps
}) => {
  const { state: { pin, reEnteredPin } = {}, setState } = usePureState(
    initialState
  );

  const { currentPin } = screenData || {};

  const error = !comparePins(pin, reEnteredPin);

  const [changePin, { loading, error: apiError }] = useChangeParentalPin();

  useLoadingComplete({
    loading,
    onComplete: () => {
      const routeToSettings = () => {
        setScreen({ screen: SCREEN.SETTINGS });
      };

      setModalProps({
        buttonProps: [
          {
            displayText: OK_I_GOT_IT,
            onClick: routeToSettings
          }
        ],
        title: apiError ? ERROR : SUCCESSFUL,
        subtitle: apiError ? PIN_CHANGE_FAILED : PIN_SETUP_SUCCESSFULLY,
        iconType: apiError ? 'warning' : 'success',
        onModalClose: routeToSettings
      });

      toggleModal();
    }
  });

  const changePinAction = () =>
    changePin({
      variables: {
        currentPin,
        newPin: pin
      }
    });

  const subProps = {
    buttonText: CONFIRM,
    buttonClassName: '',
    buttonType: 'light',
    buttonDisabled: pin.length < 6 || reEnteredPin.length < 6 || error,
    onClick: changePinAction,
    pinInputProps: [
      {
        pin,
        error,
        masked: true,
        inputTitle: ENTER_NEW_PIN,
        onChange: pinValue => setState({ pin: pinValue }),
        errorMessage: PIN_INPUT_ERROR
      },
      {
        error,
        masked: true,
        pin: reEnteredPin,
        focusOnMount: false,
        inputTitle: CONFIRM_NEW_PIN,
        onChange: reEnteredValue => setState({ reEnteredPin: reEnteredValue }),
        errorMessage: PIN_INPUT_ERROR
      }
    ]
  };

  return <SubSection {...subProps} />;
};

ChangeParentalPin.propTypes = {
  screenData: PropTypes.object,
  setScreen: PropTypes.func,
  toggleModal: PropTypes.func,
  setModalProps: PropTypes.func
};

export default ChangeParentalPin;
