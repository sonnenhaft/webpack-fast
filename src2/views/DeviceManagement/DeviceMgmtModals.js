import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';
import { ConfigContext } from '#/utils/context';

import { TextInput } from '#/components/Input';
import Modal from '#/components/Modal/Modal';

import {
  renameModal,
  removedModalTitle,
  renameModalInput,
  renameModalButton,
  renameModalButtonContainer,
  renameModalChildren
} from './deviceManagement.scss';

const RENAME_DEVICE = 'deviceMgtRename';
const NEW_NAME = 'deviceMgtNewName';
const SAVE = 'deviceMgtSave';
const DEVICE_REMOVED = 'deviceMgtDeviceRemovedLabel_web';
const DEVICE_REMOVED_OK = 'deviceMgtDeviceRemovedOk';
const DEVICE_ERROR_TITLE = 'deviceMgtFailureLabel';
const DEVICE_ERROR_SUBTITLE = 'deviceMgtFailureMessage';
const DEVICE_ERROR_CANCEL = 'deviceMgtFailureCancel';
const DEVICE_ERROR_TRY_AGAIN = 'deviceMgtFailureTryAgain';

const DeviceRemovedModal = props => (
  <Modal
    {...props}
    titleClassName={removedModalTitle}
    iconType="success"
    title={DEVICE_REMOVED}
    buttonProps={[{ displayText: DEVICE_REMOVED_OK, onClick: noop }]}
  />
);

const DevicesErrorModal = ({ onCancel = noop, onTryAgain = noop, ...rest }) => (
  <Modal
    {...rest}
    iconType="warning"
    title={DEVICE_ERROR_TITLE}
    subtitle={DEVICE_ERROR_SUBTITLE}
    buttonProps={[
      { displayText: DEVICE_ERROR_CANCEL, onClick: onCancel },
      { displayText: DEVICE_ERROR_TRY_AGAIN, onClick: onTryAgain }
    ]}
  />
);

const RenameDeviceModal = ({
  showModal,
  toggleModal,
  value = '',
  onChange = noop,
  onSaveClick = noop
}) => {
  const { messages } = useContext(ConfigContext);

  const modalProps = {
    showModal,
    toggleModal,
    buttonContainerClassName: renameModalButtonContainer,
    buttonProps: [
      {
        displayText: SAVE,
        onClick: onSaveClick,
        className: renameModalButton,
        disabled: value?.trim().length < 1
      }
    ],
    className: renameModal,
    title: RENAME_DEVICE
  };

  const getMessage = key => messages[key] || '';

  return (
    <Modal {...modalProps}>
      <div className={renameModalChildren}>
        <TextInput
          className={renameModalInput}
          placeholder={getMessage(NEW_NAME)}
          value={value}
          onChange={onChange}
          maxLength={25}
        />
      </div>
    </Modal>
  );
};

RenameDeviceModal.propTypes = {
  showModal: PropTypes.bool,
  onChange: PropTypes.func,
  toggleModal: PropTypes.func,
  onSaveClick: PropTypes.func,
  value: PropTypes.string
};

DevicesErrorModal.propTypes = {
  onCancel: PropTypes.func,
  onTryAgain: PropTypes.func
};

export { DeviceRemovedModal, RenameDeviceModal, DevicesErrorModal };
