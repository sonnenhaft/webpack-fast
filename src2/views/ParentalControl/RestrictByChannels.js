import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import _omit from 'lodash/omit';

import { useRestrictedChannels, useAllChannels } from '#/services/settings';

import { noop, isFalse, clearRouteState } from '#/helpers';
import Button from '#/components/Button/Button';
import SubSection from '#/components/SubSection/SubSection';
import SimpleResponsiveGrid from '#/components/SimpleResponsiveGrid/SimpleResponsiveGrid';
import Spinner from '#/components/Spinner/Spinner';
import Modal from '#/components/Modal/Modal';
import { ConfigContext } from '#/utils/context';
import { useLoadingComplete } from '#/utils/hooks';
import { ROUTE } from '#/constants';

import RestrictedChannelItem from './RestrictedChannelItem';

import useToggleChannels from './useToggleChannels';

import {
  restrictChannelsSubsection,
  channelsHeaderButtons,
  restrictChannelsHeader,
  restrictSaveChangesButton,
  restrictLockUnlockSection,
  channelsSubsectionSeperator,
  restrictChannelsSpinner
} from './parental-control.scss';

import {
  RESTRICT_BY_CHANNELS,
  SAVE_CHANGES,
  LOCK_ALL,
  UNLOCK_ALL,
  SELECT_CHANNELS,
  CHANNEL_CHANGE_SUCCESS,
  CHANNEL_CHANGE_ERROR,
  SUCCESSFUL,
  OK_I_GOT_IT,
  TRY_AGAIN,
  ERROR
} from './constants';

const ITEM_WIDTH = 475;
const TOTAL_PADDING = 224;

const lockAll = (items, selectedChannels) => {
  const lockedChannels = (items || []).reduce(
    (acc, curr) => ({
      ...acc,
      ...(curr?.id && { [curr?.id]: true })
    }),
    {}
  );

  return {
    ...selectedChannels,
    ...lockedChannels
  };
};

const compareSelection = (restrictedChannels = [], selectedChannels = {}) => {
  const keys = Object.keys(selectedChannels || {});

  return (
    keys?.length === restrictedChannels?.length &&
    restrictedChannels.every(({ id } = {}) => selectedChannels[id])
  );
};

const RestrictByChannels = ({ history }) => {
  const { messages } = useContext(ConfigContext);

  const { location: { state: { isAuthenticated } = {} } = {} } = history || {};
  const [redirectToSettings, setRedirectToSettings] = useState(false);
  const [modalProps, setModalProps] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const getMessage = (key = '') => messages[key] || '';

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectToSettings(true);
    }
    clearRouteState(ROUTE.RESTRICT_BY_CHANNELS);
  }, []);

  const {
    data: { nagraEpg: { items = [] } = {} } = {},
    loading: allChannelsLoading
  } = useAllChannels();
  const {
    data,
    loading: restrictedChannelsLoading,
    refetch
  } = useRestrictedChannels();

  const [toggleLoading, setToggleLoading] = useState(false);

  const {
    parentalPin: {
      isEnabled,
      restrictedChannels,
      settings: { restrictChannelsByPin } = {}
    } = {}
  } = data || {};

  const [selectedChannels, setSelectedChannels] = useState({});

  const onComplete = () => {
    refetch();
    setSelectedChannels({});
  };

  const [toggleChannels, { error }] = useToggleChannels({
    selectedChannels,
    restrictedChannels,
    onComplete
  });

  const backToMainParentalSettings = () =>
    history.push(ROUTE.PARENTAL_CONTROLS, { fromRestrictPage: true });

  useLoadingComplete({
    loading: allChannelsLoading || restrictedChannelsLoading,
    onComplete: () => {
      if (toggleLoading) {
        setToggleLoading(false);

        setModalProps({
          buttonProps: [
            {
              displayText: error ? TRY_AGAIN : OK_I_GOT_IT,
              onClick: backToMainParentalSettings
            }
          ],
          title: error ? ERROR : SUCCESSFUL,
          subtitle: error ? CHANNEL_CHANGE_ERROR : CHANNEL_CHANGE_SUCCESS,
          iconType: error ? 'warning' : 'success',
          onModalClose: noop
        });

        toggleModal();
      }
    }
  });

  useEffect(() => {
    if (restrictedChannels?.length) {
      setSelectedChannels(
        (restrictedChannels || []).reduce(
          (acc, curr) => ({
            ...acc,
            ...(curr?.id && { [curr?.id]: true })
          }),
          {}
        )
      );
    }
  }, [restrictedChannels?.length]);

  const onChannelSelect = (channelId, checked) => {
    if (!checked) {
      setSelectedChannels(_omit(selectedChannels, [channelId]));

      return;
    }
    setSelectedChannels({ ...selectedChannels, [channelId]: checked });
  };

  const channelItems = items.map((item = {}) => ({
    ...item,
    onChannelSelect,
    selectedChannels
  }));

  const loading =
    allChannelsLoading || restrictedChannelsLoading || toggleLoading;

  const selectedLength = Object.keys(selectedChannels || {}).length;

  const disableSaveChanges =
    loading || compareSelection(restrictedChannels, selectedChannels);

  const onSaveClick = () => {
    setToggleLoading(true);
    toggleChannels();
  };

  if (
    isFalse(isEnabled) ||
    isFalse(restrictChannelsByPin) ||
    redirectToSettings
  ) {
    return <Redirect to={ROUTE.PARENTAL_CONTROLS} />;
  }

  return (
    <div>
      <div className={restrictChannelsHeader}>
        <h1>{getMessage(RESTRICT_BY_CHANNELS)}</h1>
        {!loading && (
          <div className={channelsHeaderButtons}>
            <div className={restrictLockUnlockSection}>
              <Button
                white
                disabled={items?.length === selectedLength || loading}
                onClick={() =>
                  setSelectedChannels(lockAll(items, selectedChannels))
                }
                className={restrictSaveChangesButton}
                displayText={getMessage(LOCK_ALL)}
              />
              <Button
                white
                onClick={() => setSelectedChannels({})}
                className={restrictSaveChangesButton}
                displayText={getMessage(UNLOCK_ALL)}
                disabled={Boolean(!selectedLength) || loading}
              />
            </div>
            <Button
              {...{ [disableSaveChanges ? 'white' : 'light']: true }}
              onClick={onSaveClick}
              disabled={disableSaveChanges}
              className={restrictSaveChangesButton}
              displayText={getMessage(SAVE_CHANGES)}
            />
          </div>
        )}
      </div>
      <SubSection
        noSubtitle
        title={SELECT_CHANNELS}
        className={restrictChannelsSubsection}
        seperatorClassName={channelsSubsectionSeperator}
      >
        {loading ? (
          <Spinner className={restrictChannelsSpinner} />
        ) : (
          <SimpleResponsiveGrid
            data={channelItems}
            itemWidth={ITEM_WIDTH}
            containerPadding={TOTAL_PADDING}
            GridItem={RestrictedChannelItem}
          />
        )}
      </SubSection>
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

RestrictByChannels.propTypes = {
  history: PropTypes.object
};

export default RestrictByChannels;
