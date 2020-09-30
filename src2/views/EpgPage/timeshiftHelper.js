import { useMemo } from 'react';
import { getTimeshiftFormatTime, isLiveHelper } from '#/helpers/timeHelpers';
import { useStreamUrl } from '#/services/ovp/implementations/nagra';
import { STREAM_TYPE } from '#/constants';
import { useDestructureFromAuthContext } from '#/helpers/hooks';
import { AuthContext } from '#/utils/context';
import { usePrevValue } from '#/utils/hooks';

export const getTimeshiftStreamUrl = ({ streamUrl, startTime, endTime }) => {
  const { drmID, uri } = streamUrl || {};

  if (uri) {
    const timeshiftUri = new URL(uri);

    startTime
      ? timeshiftUri.searchParams.set(
          'begin',
          getTimeshiftFormatTime(startTime)
        )
      : null;
    endTime
      ? timeshiftUri.searchParams.set('end', getTimeshiftFormatTime(endTime))
      : null;

    return { drmID, uri: timeshiftUri.href };
  }

  return { drmID, uri };
};

const getCatchUpUrl = (streamUrl, startTime, endTime) =>
  getTimeshiftStreamUrl({
    streamUrl,
    startTime,
    endTime
  });

const getStartOverUrl = (streamUrl, startTime) =>
  getTimeshiftStreamUrl({ streamUrl, startTime });

export const useStreamUrlForDetails = ({
  isMovieDetails,
  startOverSupport,
  startTime,
  endTime,
  isCatchUpSupported
}) => {
  const { btv, vod } = STREAM_TYPE;
  const [
    loadStreamUrl,
    { data: { streamUrl: streamUrlFromQuery } = {}, loading }
  ] = useStreamUrl({ idType: isMovieDetails ? vod : btv });

  const streamUrl = useMemo(() => {
    if (!streamUrlFromQuery) {
      return null;
    }

    if (isMovieDetails && !startOverSupport) {
      return streamUrlFromQuery;
    }

    if (
      isCatchUpSupported &&
      !isLiveHelper({ end: endTime, start: startTime })
    ) {
      return getCatchUpUrl(streamUrlFromQuery, startTime, endTime);
    }

    if (startOverSupport) {
      return getStartOverUrl(streamUrlFromQuery, startTime);
    }

    return streamUrlFromQuery;
  }, [streamUrlFromQuery?.uri]);

  return {
    streamUrl,
    streamUrlLoading: loading,
    loadStreamUrl: id => loadStreamUrl({ variables: { id } })
  };
};

export const useStreamUrlForEpg = (programSelectedInfo = {}) => {
  const [loadStreamUrl, { data: { streamUrl } = {}, loading }] = useStreamUrl({
    idType: STREAM_TYPE.btv
  });

  const { isLoggedIn } = useDestructureFromAuthContext(AuthContext);

  const [prevId, setPrevId] = usePrevValue();

  const epgStreamUrl = useMemo(() => {
    const {
      endTime,
      isCatchUpSupported,
      startOverSupport,
      startTime
    } = programSelectedInfo;

    if (!streamUrl) {
      return null;
    }

    if (
      isCatchUpSupported &&
      !isLiveHelper({ end: endTime, start: startTime })
    ) {
      return getCatchUpUrl(streamUrl, startTime, endTime);
    }

    if (startOverSupport) {
      return getStartOverUrl(streamUrl, startTime);
    }

    return streamUrl;
  }, [streamUrl, programSelectedInfo]);

  return {
    epgStreamUrl,
    loadStreamUrl: () => {
      const { id } = programSelectedInfo;
      const programIdChanged = prevId !== id;

      if (id && isLoggedIn && programIdChanged && !loading) {
        setPrevId(id);
      }
      loadStreamUrl({ variables: { id } });
    },
    streamUrlLoading: loading
  };
};
