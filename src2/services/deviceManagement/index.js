import { useContext, useState, useEffect, useRef } from 'react';
import { noop, createHeaders } from '#/helpers';

import { TranslateContext, AuthContext } from '#/utils/context';

import {
  useRefreshMutation,
  useRefreshQuery
} from '#/services/graphql/refreshHooks';

import deviceManagementQuery from './deviceManagement.graphql';
import updateDeviceMutation from './updateDeviceMutation.graphql';
import removeDeviceMutation from './removeDeviceMutation.graphql';

import { getLoading, getError } from './helpers';

export const useRenameDevice = (id, newDeviceName) => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  const { selectedLanguage: { value: acceptLanguage } = {} } = useContext(
    TranslateContext
  );

  return useRefreshMutation({
    gql: updateDeviceMutation,
    variables: {
      id,
      newDeviceName
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken,
        acceptLanguage
      })
    }
  });
};

export const useRemoveDevice = (id = '') => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useRefreshMutation({
    gql: removeDeviceMutation,
    variables: {
      id
    },
    context: {
      headers: createHeaders({ nagraToken, ufinityToken })
    }
  });
};

export const useRemoveDevices = (
  numOfDevices = 5,
  idList = [],
  refetch = noop
) => {
  const [isRemovalComplete, setIsRemovalComplete] = useState(false);
  const [removeDevices, setRemoveDevices] = useState(false);
  const prevLoadingRef = useRef(null);

  const hookList = Array(numOfDevices)
    .fill()
    .map((_, idx) => {
      const [removeDevice, { loading, error, ...rest }] = useRemoveDevice(
        idList[idx] || ''
      );

      return { removeDevice, loading, error, ...rest };
    });

  const loading = getLoading(idList, hookList);
  const error = getError(idList, hookList);

  useEffect(() => {
    if (!removeDevices || idList.length < 1) {
      return;
    }

    setIsRemovalComplete(false);

    hookList.forEach(({ removeDevice } = {}, idx) => {
      if (idList[idx]) {
        removeDevice();
      }
    });

    setRemoveDevices(false);
  }, [removeDevices]);

  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      refetch();
      setIsRemovalComplete(true);
    }

    prevLoadingRef.current = loading;
  }, [loading]);

  return {
    removeDevices: () => setRemoveDevices(true),
    loading,
    error,
    isRemovalComplete
  };
};

export const useDeviceManagement = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  const { selectedLanguage: { value: acceptLanguage } = {} } = useContext(
    TranslateContext
  );

  return useRefreshQuery({
    gql: deviceManagementQuery,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken,
        acceptLanguage
      })
    },
    notifyOnNetworkStatusChange: true
  });
};
