import React, {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import _isBoolean from 'lodash/isBoolean';

import Spinner from '#/components/Spinner/Spinner';

import { useIsPinValid } from '#/services/r21Pin';
import { useParentalPinValid } from '#/services/settings';
import { ConfigContext } from '#/utils/context';
import {
  getPlatform,
  PLATFORM,
  DEVICE_TYPE,
  getDeviceType
} from '#/utils/getPlatform';

import OverlayComponent from '#/components/Overlay/OverlayComponent';
import { PinInput } from '#/components/Input';
import Modal from '#/components/Modal/Modal';

import { noop } from '#/helpers';

import { MODAL_ICON_TYPE, ROUTE } from '#/constants';
import {
  INCORRECT_PIN,
  PLEASE_TRY_AGAIN,
  REQUEST_NEW_PIN,
  TRY_AGAIN
} from '#/views/R21Pin/utils/constants';

import {
  customDimension,
  pinContent,
  pinForgot,
  pinTitle,
  pinSpinner
} from './pinInputModal.scss';

const PIN_TYPE = {
  R21: 'r21',
  PARENTAL: 'parental'
};

const CANCEL = 'cancelText';

const isSafari = getPlatform() === PLATFORM.safari;
const isChrome = getDeviceType() === DEVICE_TYPE.chrome;

const PinInputModal = ({
  hasPinCheck,
  pinValidAction = noop,
  playerInstanceFromContext = {},
  setIsPinValid = noop,
  setPinCheck = noop,
  isPlayback = true,
  type
}) => {
  const isR21Pin = type === PIN_TYPE.R21;
  const { messages } = useContext(ConfigContext);
  const {
    enterParentalPinMessage,
    enterParentalPinTitle,
    forgotPin,
    r21ConfirmationTitle,
    r21ConfirmationDescription
  } = messages;
  const modalMessages = {
    parental: {
      title: enterParentalPinTitle,
      content: enterParentalPinMessage
    },
    r21: {
      title: r21ConfirmationTitle,
      content: r21ConfirmationDescription
    }
  };

  const [pin, setPin] = useState('');
  const [
    checkPin,
    { data: { r21Pin: { isValid: isR21Valid } = {} } = {}, loading: r21Loading }
  ] = useIsPinValid({ withRefreshLoading: false });

  const [
    checkParentalPin,
    {
      data: { parentalPin: { isValid: isParentalValid } = {} } = {},
      loading: parentalLoading
    }
  ] = useParentalPinValid();

  const loading = isR21Pin ? r21Loading : parentalLoading;

  const isValid = isR21Pin ? isR21Valid : isParentalValid;

  const clearPin = () => setPin('');
  const hideOverlayState = () => setPinCheck(false);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const history = useHistory();

  const incorrectPinModalProps = {
    buttonProps: [
      {
        displayText: isR21Pin ? REQUEST_NEW_PIN : CANCEL,
        onClick: isR21Pin
          ? () => {
              history.push({
                pathname: '/r21-pin',
                state: { requestNewPin: true }
              });
            }
          : hideOverlayState
      },
      {
        displayText: TRY_AGAIN,
        onClick: clearPin
      }
    ],
    iconType: MODAL_ICON_TYPE.warning,
    subtitle: PLEASE_TRY_AGAIN,
    title: INCORRECT_PIN
  };

  const pinLengthRef = useRef(0);

  useEffect(() => {
    if (_isBoolean(isValid)) {
      if (!isValid && !showModal) {
        toggleModal();

        return;
      }

      setIsPinValid(true);
    }
  }, [isValid]);

  useEffect(() => {
    if (isSafari && isValid && !isPlayback) {
      pinValidAction(true, { isPinValid: true });
    }
  }, [isValid]);

  useEffect(() => {
    if (pin.length === 6 && !loading) {
      const checkUserPin = isR21Pin ? checkPin : checkParentalPin;

      checkUserPin({ variables: { currentPin: pin } });
    }
    pinLengthRef.current = pin.length;
  }, [pin.length]);

  useEffect(() => {
    if (_isBoolean(isValid)) {
      clearPin();

      if (!isValid) {
        pinValidAction(false);
        if (isSafari) {
          playerInstanceFromContext?.exitFullscreen?.();
        }

        return;
      }

      if (isChrome || (isSafari && isPlayback)) {
        pinValidAction(true, { isPinValid: true });
      }

      setIsPinValid(false);
      hideOverlayState();
    }
  }, [isValid, loading]);

  return (
    <OverlayComponent
      customDimension={customDimension}
      isOverlayOpen={hasPinCheck}
      toggleOverlayState={hideOverlayState}
    >
      <span className={pinTitle}>{modalMessages[type]?.title}</span>
      <span className={pinContent}>{modalMessages[type]?.content}</span>
      {pin.length !== 6 ? (
        <Fragment>
          <PinInput masked onChange={setPin} pin={pin} />
          <Link
            to={{
              pathname: isR21Pin ? ROUTE.R21_PIN : ROUTE.PARENTAL_CONTROLS,
              state: { forgotPin: true }
            }}
            className={pinForgot}
          >
            {forgotPin}
          </Link>
        </Fragment>
      ) : (
        <Spinner className={pinSpinner} />
      )}
      <Modal
        showModal={incorrectPinModalProps && showModal}
        toggleModal={toggleModal}
        {...incorrectPinModalProps}
      />
    </OverlayComponent>
  );
};

PinInputModal.propTypes = {
  children: PropTypes.node,
  hasPinCheck: PropTypes.bool,
  pinValidAction: PropTypes.func,
  playerInstanceFromContext: PropTypes.object,
  setIsPinValid: PropTypes.func,
  setPinCheck: PropTypes.func,
  isPlayback: PropTypes.bool,
  type: PropTypes.oneOf([PIN_TYPE.R21, PIN_TYPE.PARENTAL])
};

export default PinInputModal;
