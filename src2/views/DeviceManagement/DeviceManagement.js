import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { usePureState } from '#/utils/hooks';
import { ConfigContext } from '#/utils/context';
import {
  useDeviceManagement,
  useRemoveDevices
} from '#/services/deviceManagement';

import PageTitle from '#/components/PageTitle/PageTitle';
import SubSection from '#/components/SubSection/SubSection';
import Spinner from '#/components/Spinner/Spinner';

import DeviceItem from './DeviceItem';
import {
  RenameDeviceModal,
  DeviceRemovedModal,
  DevicesErrorModal
} from './DeviceMgmtModals';
import {
  getCheckBoxStates,
  resetCheckBoxStates,
  getBoxesChecked,
  useDeviceRename,
  getCheckedDeviceIds
} from './utilities';

import {
  pageTitle,
  deviceMaxItems,
  deviceListContainer,
  sectionButton,
  loadingSpinner
} from './deviceManagement.scss';

const PAGE_TITLE = 'deviceMgtTitle';
const SECTION_TITLE = 'deviceMgtRemoveMessage';
const REMOVE = 'deviceMgtRemove';
const MAX_5_DEVICES = 'deviceMgtMaxDevicesLabel_web';

const initialState = {
  showModal: false,
  currentIndex: -1,
  value: '',
  checked: false
};

const MAX_DEVICES = 5;

const exitPage = history => () => {
  if (history?.action === 'PUSH') {
    history.goBack();

    return;
  }

  history.push('/');
};

const DeviceList = ({ messages = {}, history = {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRemovedModal, setShowRemovedModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const goBack = exitPage(history);

  const getMessage = key => messages[key] || '';

  const { state: { currentIndex, value } = {}, setState } = usePureState(
    initialState
  );

  const {
    data: { deviceList: devices = [] } = {},
    refetch,
    loading,
    error
  } = useDeviceManagement();

  const deviceList = (devices || []).slice(0, MAX_DEVICES);

  const checkedStates = getCheckBoxStates(MAX_DEVICES);

  const selectedDeviceIds = getCheckedDeviceIds(checkedStates, deviceList);

  const { removeDevices, isRemovalComplete } = useRemoveDevices(
    MAX_DEVICES,
    selectedDeviceIds,
    refetch
  );

  const { id: currentDeviceId = '' } = deviceList[currentIndex] || {};

  const { renameDevice, renameLoading, updatedDeviceId } = useDeviceRename({
    currentDeviceId,
    value: value.trim()
  });

  const isLoading = loading || renameLoading;

  const isChecked = getBoxesChecked(checkedStates);

  const onChange = inputValue => setState({ value: inputValue });
  const toggleModal = index => {
    if (index === 0 || index) {
      setState({ currentIndex: index, value: '' });
    }

    setShowModal(!showModal);
  };

  const toggleRemovedModal = () => setShowRemovedModal(!showRemovedModal);
  const toggleErrorModal = () => setShowErrorModal(!showErrorModal);

  useEffect(() => {
    const { length } = devices || [];

    if (!error) {
      setShowErrorModal(false);

      return;
    }

    if (error && length < 1 && !showErrorModal) {
      toggleErrorModal();
    }
  }, [error, devices]);

  useEffect(() => {
    if (updatedDeviceId) {
      refetch();
    }
  }, [updatedDeviceId]);

  useEffect(() => {
    if (isRemovalComplete) {
      resetCheckBoxStates(checkedStates);
      toggleRemovedModal();
    }
  }, [isRemovalComplete]);

  const renameModalProps = {
    value,
    onChange,
    showModal,
    toggleModal
  };

  if (isLoading) {
    return <Spinner className={loadingSpinner} />;
  }

  return (
    <SubSection
      noSubtitle
      title={SECTION_TITLE}
      buttonText={REMOVE}
      buttonClassName={sectionButton}
      buttonDisabled={!isChecked}
      onClick={removeDevices}
    >
      <div className={deviceListContainer}>
        {deviceList.map((device = {}, idx) => (
          <DeviceItem
            {...device}
            {...checkedStates[idx]}
            onClick={toggleModal}
            key={`device-${idx}`}
            index={idx}
          />
        ))}
      </div>
      <DevicesErrorModal
        showModal={showErrorModal}
        toggleModal={toggleErrorModal}
        onCancel={goBack}
        onTryAgain={refetch}
        onModalClose={goBack}
      />
      <RenameDeviceModal
        {...renameModalProps}
        onSaveClick={() => {
          if (value?.trim()?.length) {
            renameDevice();
          }
        }}
      />
      <DeviceRemovedModal
        showModal={showRemovedModal}
        toggleModal={toggleRemovedModal}
      />
      <div className={deviceMaxItems}>{getMessage(MAX_5_DEVICES)}</div>
    </SubSection>
  );
};

const DeviceManagement = ({ history = {} }) => {
  const { messages } = useContext(ConfigContext);
  const getMessage = key => messages[key] || '';

  return (
    <div>
      <PageTitle text={getMessage(PAGE_TITLE)} className={pageTitle} />
      <DeviceList messages={messages} history={history} />
    </div>
  );
};

DeviceList.propTypes = {
  messages: PropTypes.object,
  history: PropTypes.object
};

DeviceManagement.propTypes = {
  history: PropTypes.object
};

export default DeviceManagement;
