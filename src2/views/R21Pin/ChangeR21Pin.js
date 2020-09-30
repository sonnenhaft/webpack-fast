import React from 'react';
import PropTypes from 'prop-types';

import SubSection from '#/components/SubSection/SubSection';
import { useChangePin } from '#/services/r21Pin';
import { usePureState, useLoadingComplete } from '#/utils/hooks';
import { noop, getExitPageHandler, comparePins } from '#/helpers';

import { dobButton } from './r21-pin.scss';

import {
  SCREEN,
  CHANGE_CURRENT_PIN_TITLE,
  ENTER_NEW_R21_PIN,
  CONFIRM_NEW_PIN,
  PIN_INPUT_ERROR,
  CONFIRM,
  R21_PIN_CHANGED_SUCCESS,
  R21_PIN_CHANGE_ERROR,
  OK_I_GOT_IT,
  RESTRICTED_CONTENT,
  SUCCESSFUL,
  TRY_AGAIN
} from './utils/constants';

const initialState = {
  pin: '',
  reEnteredPin: ''
};

const ChangeR21Pin = ({
  setModalProps = noop,
  screenData,
  toggleModal,
  history
}) => {
  const { screen, currentPin } = screenData || {};
  const { state, setState } = usePureState(initialState);
  const { pin, reEnteredPin } = state;

  const exitPage = getExitPageHandler(history);

  const clearPin = () => setState(initialState);

  const [changePin, { data, error: apiError, loading }] = useChangePin({
    currentPin,
    newPin: pin,
    withRefreshLoading: false
  });

  const error = !comparePins(pin, reEnteredPin);

  const subProps = {
    buttonText: CONFIRM,
    buttonClassName: dobButton,
    buttonType: 'light',
    buttonDisabled: pin.length < 6 || reEnteredPin.length < 6 || error,
    onClick: changePin,
    pinInputProps: [
      {
        pin,
        error,
        masked: true,
        inputTitle:
          screen === SCREEN.CREATE_NEW_PIN
            ? ENTER_NEW_R21_PIN
            : CHANGE_CURRENT_PIN_TITLE,
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

  useLoadingComplete({
    loading,
    onComplete: () => {
      const hasError = !data || apiError;

      const onVerificationSucss = () => {
        clearPin();
        exitPage();
      };

      const iconType = hasError ? 'warning' : 'success';
      const title = hasError ? RESTRICTED_CONTENT : SUCCESSFUL;
      const subtitle = hasError
        ? R21_PIN_CHANGE_ERROR
        : R21_PIN_CHANGED_SUCCESS;

      const buttonProps = [
        {
          displayText: hasError ? TRY_AGAIN : OK_I_GOT_IT,
          onClick: hasError ? clearPin : onVerificationSucss
        }
      ];

      setModalProps({
        buttonProps,
        title,
        subtitle,
        iconType,
        onModalClose: hasError ? clearPin : onVerificationSucss
      });

      toggleModal();
    }
  });

  return <SubSection {...subProps} />;
};

ChangeR21Pin.propTypes = {
  screenData: PropTypes.object,
  setModalProps: PropTypes.func,
  setScreen: PropTypes.func,
  toggleModal: PropTypes.func,
  history: PropTypes.object
};

export default ChangeR21Pin;
