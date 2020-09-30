import React from 'react';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';

import { Checkbox } from '#/components/Input';
import { EditIcon } from '#/components/Icons';

import {
  checkboxContainer,
  deviceItem,
  nameSection,
  editButton,
  editIcon,
  editIconContainer
} from './deviceManagement.scss';

const DEVICE = 'Device';

const DeviceEditButton = ({ onClick = noop }) => (
  <button className={editButton} onClick={onClick}>
    <EditIcon iconContainer={editIconContainer} iconStyle={editIcon} />
  </button>
);

const DeviceItem = ({
  name,
  isCurrentDevice,
  checked,
  index,
  setChecked = noop,
  onClick = noop
}) => {
  const onEditClick = () => onClick(index);

  return (
    <div className={deviceItem}>
      <div className={nameSection}>
        <span>{name || DEVICE}</span>
        {!isCurrentDevice && (
          <Checkbox
            className={checkboxContainer}
            checked={checked}
            onChange={() => setChecked(!checked)}
            type="tick"
          />
        )}
      </div>
      <DeviceEditButton onClick={onEditClick} />
    </div>
  );
};

DeviceEditButton.propTypes = {
  onClick: PropTypes.func
};

DeviceItem.propTypes = {
  checked: PropTypes.bool,
  index: PropTypes.number,
  isCurrentDevice: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func,
  setChecked: PropTypes.func
};

export default DeviceItem;
