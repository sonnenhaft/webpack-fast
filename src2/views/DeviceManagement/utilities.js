import { useState } from 'react';

import { useRenameDevice } from '#/services/deviceManagement';

export const getCheckBoxStates = (maxDevices = 5) =>
  Array(maxDevices)
    .fill()
    .map(() => {
      const [checked, setChecked] = useState(false);

      return { checked, setChecked };
    });

export const resetCheckBoxStates = (stateList = []) => {
  stateList.forEach(({ checked, setChecked }) => {
    if (checked) {
      setChecked(false);
    }
  });
};

export const useDeviceRename = ({ currentDeviceId, value }) => {
  const [
    renameDevice,
    { data: { updateDevice: { id, name } = {} } = {}, loading: renameLoading }
  ] = useRenameDevice(currentDeviceId, value);

  return { renameDevice, renameLoading, updatedDeviceId: id || name };
};

export const getBoxesChecked = (stateList = []) => {
  const { length } = stateList
    .reduce((acc, curr) => {
      return [...acc, curr?.checked];
    }, [])
    .filter(Boolean);

  return length > 0;
};

export const getCheckedDeviceIds = (stateList = [], deviceList = []) =>
  stateList.reduce((acc, { checked } = {}, currIdx) => {
    const device = deviceList[checked && currIdx];

    return [...acc, device?.id].filter(Boolean);
  }, []);
