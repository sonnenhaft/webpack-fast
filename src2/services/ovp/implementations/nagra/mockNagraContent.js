import moment from 'moment-mini';
import { getDeviceType, DEVICE_TYPE } from '#/utils/getPlatform';

const { chrome } = DEVICE_TYPE;
const isChrome = getDeviceType() === chrome;

const mockContentTemplate = ({
  dashContentId,
  dashUrl,
  hasTimeshiftUrlExtension,
  hlsContentId,
  hlsUrl
}) => [
  {
    id: 'GLOBAL_CT0000004664_VERSION_HLS',
    deviceType: ['IOS'],
    media: {
      avPlaylistName: {
        drmId: hlsContentId,
        drmInstanceName: 'security_device',
        uri: `${hlsUrl}${hasTimeshiftUrlExtension}`,
        fileName: `${hlsUrl}${hasTimeshiftUrlExtension}`
      }
    }
  },
  {
    id: 'GLOBAL_CT0000004664_VERSION_DASH',
    deviceType: ['Chrome', 'Android'],
    media: {
      avPlaylistName: {
        drmId: dashContentId,
        drmInstanceName: 'security_device',
        uri: `${dashUrl}${hasTimeshiftUrlExtension}`,
        fileName: `${dashUrl}${hasTimeshiftUrlExtension}`
      }
    }
  }
];

export const mockStream = ({
  configuredLinearContent,
  programSelectedInfo: { startTime = null, endTime = null } = {}
}) => {
  const {
    hls: { stream: hlsStream, contentId: hlsContentId } = {},
    dash: { stream: dashStream, contentId: dashContentId } = {}
  } = configuredLinearContent;
  const utcStartTime = moment.utc(startTime).format('YYYYMMDDTHHmmss');
  const utcEndTime = moment.utc(endTime).format('YYYYMMDDTHHmmss');
  const timeshiftUrlExtension = `?begin=${utcStartTime}&end=${utcEndTime}`;
  const isLive = startTime < Date.now() && endTime > Date.now();
  const hasTimeshiftUrlExtension =
    !isLive && startTime && endTime ? timeshiftUrlExtension : '';

  return {
    drmID: isChrome ? dashContentId : hlsContentId,
    uri: isChrome
      ? `${dashStream}${hasTimeshiftUrlExtension}`
      : `${hlsStream}${hasTimeshiftUrlExtension}`
  };
};

export const mockVod = content => {
  const {
    hls: { stream: hlsVod, contentId: hlsContentId } = {},
    dash: { stream: dashVod, contentId: dashContentId } = {}
  } = content;

  return mockContentTemplate({
    dashContentId,
    dashUrl: dashVod,
    hasTimeshiftUrlExtension: '',
    hlsContentId,
    hlsUrl: hlsVod
  });
};
