import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { usePureState } from '#/utils/hooks';
import { getErrorCodeAndMessage, noop } from '#/helpers';
import { PinInput } from '#/components/Input';
import SubSection from '#/components/SubSection/SubSection';
import Spinner from '#/components/Spinner/Spinner';

import { useSendResetEmail, useParentalPinValid } from '#/services/settings';

import { dobButton, setPinSpinner } from './parental-control.scss';

import {
  STEP_2_PARENTAL_PIN,
  SENT_TO_YOUR_EMAIL,
  PIN_INPUT_ERROR,
  CONFIRM,
  SCREEN,
  TRY_AGAIN,
  ERROR,
  INCORRECT_PIN_FROM_EMAIL,
  REQUEST_NEW_PIN
} from './constants';

const initialState = {
  pin: '',
  emailLoading: true
};

const SetParentalPin = ({
  setScreen = noop,
  setModalProps = noop,
  toggleModal = noop
}) => {
  const { state, setState } = usePureState(initialState);

  const { pin, emailLoading } = state || {};

  const setPin = (pinValue = '') => setState({ pin: pinValue });

  const resetLoadingRef = useRef(null);
  const loadingRef = useRef(null);
  const [
    checkIfValid,
    { data: { parentalPin: { isValid } = {} } = {}, loading }
  ] = useParentalPinValid();

  const [
    sendResetEmail,
    { loading: resetEmailLoading, error: resetEmailError }
  ] = useSendResetEmail();

  const subProps = {
    title: STEP_2_PARENTAL_PIN,
    ...(!emailLoading && {
      subtitle: SENT_TO_YOUR_EMAIL,
      buttonText: CONFIRM
    }),

    buttonClassName: dobButton,
    buttonType: 'light',
    buttonDisabled: pin.length < 6 || resetEmailLoading,
    onClick: () => checkIfValid({ variables: { currentPin: pin } })
  };

  const sendEmailAndClear = () => {
    sendResetEmail();
    setState(initialState);
  };

  useEffect(() => {
    sendResetEmail();
  }, []);

  useEffect(() => {
    if (resetLoadingRef.current && !resetEmailLoading) {
      setState({ emailLoading: false });

      const { code, message } = getErrorCodeAndMessage(resetEmailError) || {};
      if (resetEmailError) {
        setModalProps({
          iconType: 'warning',
          title: ERROR,
          subtitleText: `[${code}] ${message}`,
          buttonProps: [
            {
              displayText: REQUEST_NEW_PIN,
              onClick: sendEmailAndClear
            }
          ],
          onModalClose: () =>
            setScreen({
              screen: SCREEN.ENTER_PIN
            })
        });

        toggleModal();
      }
    }
    resetLoadingRef.current = resetEmailLoading;
  }, [resetEmailLoading, resetEmailError]);

  useEffect(() => {
    if (loadingRef.current && !loading) {
      if (isValid) {
        setScreen({
          screen: SCREEN.CREATE_NEW_PIN,
          currentPin: pin
        });

        return;
      }

      setModalProps({
        iconType: 'warning',
        title: ERROR,
        subtitle: INCORRECT_PIN_FROM_EMAIL,
        buttonProps: [
          {
            displayText: REQUEST_NEW_PIN,
            onClick: sendEmailAndClear
          },
          {
            displayText: TRY_AGAIN,
            onClick: setPin
          }
        ],
        onModalClose: setPin
      });

      toggleModal();
    }

    loadingRef.current = loading;

    return () => setModalProps(null);
  }, [loading]);

  return (
    <SubSection {...subProps}>
      {emailLoading ? (
        <Spinner className={setPinSpinner} />
      ) : (
        <PinInput
          masked
          pin={pin}
          onChange={setPin}
          errorMessage={PIN_INPUT_ERROR}
        />
      )}
    </SubSection>
  );
};

SetParentalPin.propTypes = {
  history: PropTypes.object,
  setModalProps: PropTypes.func,
  toggleModal: PropTypes.func,
  setScreen: PropTypes.func
};

export default SetParentalPin;
