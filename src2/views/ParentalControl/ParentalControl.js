import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ConfigContext } from '#/utils/context';

import Spinner from '#/components/Spinner/Spinner';
import Modal from '#/components/Modal/Modal';
import { useLoadingComplete } from '#/utils/hooks';

import { useParentalSettings } from '#/services/settings';

import { ROUTE } from '#/constants';
import { clearRouteState, noop, isFalse } from '#/helpers';

import ParentalSettings from './ParentalSettings';
import ChangeParentalPin from './ChangeParentalPin';
import EnterParentalPin from './EnterParentalPin';
import UpdateParentalEmail from './UpdateParentalEmail';
import SetPinFromResetEmail from './SetPinFromResetEmail';

import {
  pageTitle,
  loadingSpinner,
  mainContainer
} from './parental-control.scss';

import {
  SCREEN,
  PAGE_TITLE,
  SET_NEW_PIN,
  PARENTAL_CREATE_NEW_PIN,
  DEFAULT_PARENTAL_PIN,
  ENTER_PARENTAL_PIN
} from './constants';

const pageMap = {
  [SCREEN.CHANGE_PIN]: {
    title: SET_NEW_PIN,
    subTitle: DEFAULT_PARENTAL_PIN,
    Component: ChangeParentalPin
  },
  [SCREEN.SETTINGS]: {
    title: PAGE_TITLE,
    Component: ParentalSettings
  },
  [SCREEN.ENTER_PIN]: {
    title: ENTER_PARENTAL_PIN,
    Component: EnterParentalPin
  },
  [SCREEN.UPDATE_EMAIL]: {
    title: SET_NEW_PIN,
    Component: UpdateParentalEmail
  },
  [SCREEN.SET_PIN_RESET_EMAIL]: {
    title: SET_NEW_PIN,
    Component: SetPinFromResetEmail
  },
  [SCREEN.CREATE_NEW_PIN]: {
    title: PARENTAL_CREATE_NEW_PIN,
    Component: ChangeParentalPin
  }
};

const ParentalControl = ({ history = { push: noop } }) => {
  const { data, loading, refetch } = useParentalSettings();

  const {
    parentalPin: { isEnabled, settings = {} } = {},
    settings: { hasEmail } = {}
  } = data || {};

  const { location: { state: { forgotPin } = {} } = {} } = history;

  const [pageLoading, setPageLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState(null);

  const [screenData, setScreen] = useState({
    screen: SCREEN.ENTER_PIN
  });

  const { screen } = screenData || {};

  const { Component, title, subTitle } = pageMap[screen] || {};

  const { messages } = useContext(ConfigContext);

  const getMessage = key => messages[key] || '';

  const toggleModal = () => setShowModal(!showModal);

  useLoadingComplete({
    loading,
    onComplete: () => {
      if (isFalse(isEnabled) || history?.location?.state?.fromRestrictPage) {
        setScreen({ screen: SCREEN.SETTINGS });
      }

      if (isEnabled && forgotPin) {
        setScreen({
          screen: hasEmail ? SCREEN.SET_PIN_RESET_EMAIL : SCREEN.UPDATE_EMAIL
        });
      }

      setPageLoading(false);
    }
  });

  useEffect(() => {
    clearRouteState(ROUTE.PARENTAL_CONTROLS);
  }, []);

  if (pageLoading || loading) {
    return <Spinner className={loadingSpinner} />;
  }

  return (
    <div className={mainContainer}>
      {title && (
        <div className={pageTitle}>
          <h1>{getMessage(title)}</h1>
          {subTitle && <span>{getMessage(DEFAULT_PARENTAL_PIN)}</span>}
        </div>
      )}
      <Component
        setScreen={setScreen}
        screenData={screenData}
        history={history}
        parentalPinSettings={{ ...settings, isPinEnabled: isEnabled }}
        getMessage={getMessage}
        setModalProps={setModalProps}
        toggleModal={toggleModal}
        refetchSettings={refetch}
      />
      {showModal && modalProps && (
        <Modal
          {...modalProps}
          showModal={showModal}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
};

ParentalControl.propTypes = {
  history: PropTypes.object
};

export default ParentalControl;
