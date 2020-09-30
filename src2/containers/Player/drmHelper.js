import { useAccedoOneConfig } from '#/services/accedoOne';
import { getPlatform, PLATFORM } from '#/utils/getPlatform';

const { DRM_PRODUCTION_CONFIG } = __ENV_CONFIG__;

const fairPlayMode = undefined;
const myTenantId = DRM_PRODUCTION_CONFIG ? 'SCVM1SC0' : 'SCV23REH';
const LICENCE_SERVER_URL = DRM_PRODUCTION_CONFIG
  ? 'https://scvm1sc0.anycast.nagra.com'
  : 'https://scv23reh.anycast.nagra.com';
const FAIRPLAY_LICENCE_SERVER_URL = LICENCE_SERVER_URL;
const SSP_LICENCE_SERVER_URL = LICENCE_SERVER_URL;
const SSM_SERVER_URL = DRM_PRODUCTION_CONFIG
  ? 'https://scvm1sc0-ssm.anycast.nagra.com/SCVM1SC0/ssm'
  : 'https://scv23reh-ssm.anycast.nagra.com/SCV23REH/ssm';

export const getDrmConfig = () => {
  const {
    data: {
      accedoOne: { drmSSMEndpointURL, drmSSMLicenseKey, drmSSMLicenseURL } = {}
    } = {}
  } = useAccedoOneConfig();

  return {
    drmSSMEndpointURL,
    drmSSMLicenseKey,
    drmSSMLicenseURL
  };
};

export const setDrmSystem = ({
  drmSSMEndpointURL,
  drmSSMLicenseKey,
  drmSSMLicenseURL
}) => {
  if (getPlatform() === PLATFORM.safari) {
    if (fairPlayMode === undefined || fairPlayMode === 'nagra-ssp-fps') {
      return {
        system: 'nagra-ssp-fps',
        config: {
          tenantId: drmSSMLicenseKey || myTenantId,
          licenceServer: drmSSMEndpointURL || FAIRPLAY_LICENCE_SERVER_URL,
          ssmServer: drmSSMLicenseURL || SSM_SERVER_URL
        }
      };
    }
    // this is not needed at the moment
    // if (fairPlayMode === 'nagra-conax-fps') {
    //   return {
    //     system: 'nagra-conax-fps',
    //     config: {
    //       portalURL: CONAX_PORTAL_URL,
    //       certificatesURL: CONAX_CERTIFICATE_URL,
    //       licenceServer: CONAX_LICENCE_SERVER_URL
    //     }
    //   };
    // }
  } else {
    return {
      system: 'nagra-ssp',
      config: {
        mode: 'token',
        tenantId: drmSSMLicenseKey || myTenantId,
        licenceServer: drmSSMEndpointURL || SSP_LICENCE_SERVER_URL,
        ssmServer: drmSSMLicenseURL || SSM_SERVER_URL
      }
    };
  }
};
