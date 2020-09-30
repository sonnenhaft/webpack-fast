import React, { useContext, useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import _isBoolean from 'lodash/isBoolean';

import PageTitle from '#/components/PageTitle/PageTitle';
import { ConfigContext } from '#/utils/context';
import { useLoadingComplete } from '#/utils/hooks';
import Modal from '#/components/Modal/Modal';
import Spinner from '#/components/Spinner/Spinner';
import UpdateEmailSection from '#/components/UpdateEmailSection/UpdateEmailSection';
import { useR21Pin } from '#/services/r21Pin';

import { numOfKeys, getExitPageHandler } from '#/helpers';

import {
  ENTER_R21_PIN,
  SET_R21_PIN,
  CHANGE_R21_PIN,
  SCREEN,
  RESTRICTED_CONTENT,
  NEED_TO_BE_21,
  OK_I_GOT_IT,
  CREATE_NEW_PIN
} from './utils/constants';
import UpdateDob from './UpdateDOB';
import SetR21Pin from './SetR21Pin';
import EnterR21Pin from './EnterR21Pin';
import ChangeR21Pin from './ChangeR21Pin';

import {
  mainContainer,
  mainTitle,
  topProgressBar,
  r21Spinner
} from './r21-pin.scss';

const ProgressLine = ({ progress = 25 }) => (
  <div style={{ width: `${progress}%` }} className={topProgressBar} />
);

const UpdateEmailSubSection = ({ setScreen, isPinEnabled, ...rest }) => (
  <UpdateEmailSection
    {...rest}
    r21Pin
    onEmailUpdateComplete={() => {
      const cannotSetR21Pin = _isBoolean(isPinEnabled) && !isPinEnabled;

      setScreen({ screen: !cannotSetR21Pin ? SCREEN.UPDATE_DOB : null });
    }}
  />
);

export const pageMap = {
  [SCREEN.UPDATE_EMAIL]: {
    titleKey: SET_R21_PIN,
    progress: 25,
    Component: UpdateEmailSubSection
  },
  [SCREEN.UPDATE_DOB]: {
    titleKey: SET_R21_PIN,
    progress: 50,
    Component: UpdateDob
  },
  [SCREEN.SET_R21_PIN]: {
    titleKey: SET_R21_PIN,
    progress: 95,
    Component: SetR21Pin
  },
  [SCREEN.ENTER_R21_PIN]: {
    titleKey: CHANGE_R21_PIN,
    progress: 40,
    Component: EnterR21Pin
  },
  [SCREEN.CHANGE_R21_PIN]: {
    titleKey: CHANGE_R21_PIN,
    progress: 90,
    Component: ChangeR21Pin
  },
  [SCREEN.CREATE_NEW_PIN]: {
    titleKey: CREATE_NEW_PIN,
    progress: 95,
    Component: ChangeR21Pin
  }
};

const getFirstRoute = ({ isEnabled, hasEmail, forgotPin, requestNewPin }) => {
  const isNotSet = !_isBoolean(isEnabled);

  if (_isBoolean(isEnabled) && !isEnabled) {
    return null;
  }

  if (forgotPin) {
    const resetPinRoute = isNotSet ? SCREEN.UPDATE_DOB : SCREEN.SET_R21_PIN;

    return hasEmail ? resetPinRoute : SCREEN.UPDATE_EMAIL;
  }

  if (requestNewPin) {
    return SCREEN.SET_R21_PIN;
  }

  return SCREEN.ENTER_R21_PIN;
};

const R21Pin = ({ history }) => {
  const [r21Query, { data: r21PinData, loading }] = useR21Pin();
  const { r21Pin: { isEnabled } = {}, settings: { hasEmail } = {} } =
    r21PinData || {};

  const {
    location: { state: { forgotPin, requestNewPin } = {} } = {}
  } = history;

  const { messages } = useContext(ConfigContext);

  const [modalProps, setModalProps] = useState(null);
  const [screenData, setScreen] = useState({ screen: SCREEN.UPDATE_EMAIL });
  const [showModal, setShowModal] = useState(false);

  const { screen } = screenData || {};
  const currentPage = pageMap[screen] || {};
  const { titleKey, progress, Component } = currentPage;

  const toggleModal = () => setShowModal(!showModal);
  const exitPage = getExitPageHandler(history);

  useLoadingComplete({
    loading,
    onComplete: () =>
      setScreen({
        screen: getFirstRoute({
          isEnabled,
          hasEmail,
          forgotPin,
          requestNewPin
        }),
        sectionTitle: requestNewPin ? ENTER_R21_PIN : undefined
      })
  });

  useEffect(() => {
    if (!numOfKeys(currentPage) && !showModal) {
      setModalProps({
        buttonProps: [{ displayText: OK_I_GOT_IT, onClick: exitPage }],
        title: RESTRICTED_CONTENT,
        subtitle: NEED_TO_BE_21,
        iconType: 'warning',
        onModalClose: exitPage
      });

      toggleModal();
    }
  }, [currentPage]);

  useEffect(() => {
    r21Query();
  }, []);

  if (loading) {
    return <Spinner className={r21Spinner} />;
  }

  return (
    <Fragment>
      {numOfKeys(currentPage) ? (
        <div className={mainContainer}>
          <PageTitle text={messages[titleKey] || ''} className={mainTitle} />
          {Component && (
            <Component
              isPinEnabled={isEnabled}
              toggleModal={toggleModal}
              setModalProps={setModalProps}
              setScreen={setScreen}
              screenData={screenData}
              history={history}
            />
          )}
          <ProgressLine progress={progress} />
        </div>
      ) : null}
      <Modal
        showModal={modalProps && showModal}
        toggleModal={toggleModal}
        {...modalProps || {}}
      />
    </Fragment>
  );
};

ProgressLine.propTypes = {
  progress: PropTypes.number
};

R21Pin.propTypes = {
  history: PropTypes.object
};

UpdateEmailSubSection.propTypes = {
  setScreen: PropTypes.func,
  isPinEnabled: PropTypes.bool
};

export default R21Pin;
