import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { usePureState } from '#/utils/hooks';
import { useIsPinValid, useSendR21EmailReset } from '#/services/r21Pin';
import { getErrorCodeAndMessage, noop } from '#/helpers';
import { PinInput } from '#/components/Input';
import SubSection from '#/components/SubSection/SubSection';
import Spinner from '#/components/Spinner/Spinner';

import { dobButton, setPinSpinner } from './r21-pin.scss';

import {
  STEP_3_ENTER_R21_PIN,
  PIN_SENT_TO_EMAIL,
  PIN_INPUT_ERROR,
  CONFIRM,
  SCREEN,
  TRY_AGAIN,
  PLEASE_TRY_AGAIN,
  INCORRECT_PIN,
  REQUEST_NEW_PIN,
  R21_GENERIC_ERROR
} from './utils/constants';

const initialState = {
  pin: '',
  emailLoading: true
};

const SetR21Pin = ({
  setScreen = noop,
  setModalProps = noop,
  toggleModal = noop,
  screenData
}) => {
  const { state, setState } = usePureState(initialState);
  const { sectionTitle } = screenData || {};

  const { pin, emailLoading } = state || {};

  const setPin = (pinValue = '') => setState({ pin: pinValue });

  const resetLoadingRef = useRef(null);
  const loadingRef = useRef(null);
  const [
    checkIfValid,
    { data: { r21Pin: { isValid } = {} } = {}, loading }
  ] = useIsPinValid({
    withRefreshLoading: false
  });

  const [
    sendResetEmail,
    { loading: resetEmailLoading, error: resetEmailError }
  ] = useSendR21EmailReset();

  const subProps = {
    title: sectionTitle || STEP_3_ENTER_R21_PIN,
    ...(!emailLoading && {
      subtitle: PIN_SENT_TO_EMAIL,
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
          title: R21_GENERIC_ERROR,
          subtitleText: `[${code}] ${message}`,
          buttonProps: [
            {
              displayText: REQUEST_NEW_PIN,
              onClick: sendEmailAndClear
            }
          ],
          onModalClose: () =>
            setScreen({
              screen: SCREEN.ENTER_R21_PIN
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
        title: INCORRECT_PIN,
        subtitle: PLEASE_TRY_AGAIN,
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

SetR21Pin.propTypes = {
  history: PropTypes.object,
  setModalProps: PropTypes.func,
  toggleModal: PropTypes.func,
  screenData: PropTypes.object,
  setScreen: PropTypes.func
};

export default SetR21Pin;
