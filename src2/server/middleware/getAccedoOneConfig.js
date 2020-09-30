import accedoOne, {
  ACCEDO_ONE_PROFILE,
  ACCEDO_ONE_SERVICE,
  SESSION_KEY
} from '#/config/accedoOne';

const ACCEDO_ONE_BASE_URL = `https://api.one.accedo.tv/`;
const { appKey } = accedoOne || {};

const accedoOneFetchHelper = async ({ endpointType, sessionKey }) => {
  const endpoint = `${ACCEDO_ONE_BASE_URL}${endpointType}?sessionKey=${sessionKey}`;

  try {
    const response = await fetch(endpoint);
    const accedoOneData = await response.json();

    return accedoOneData;
  } catch (error) {
    if (__DEVTOOLS__) {
      console.warn(`Accedo One error: ${error}`);
    }
  }
};

export const getAccedoOneMetaData = async sessionKey => {
  const metadata = await accedoOneFetchHelper({
    endpointType: 'metadata',
    sessionKey
  });

  return metadata;
};

export const getAccedoOneProfile = async sessionKey => {
  const profileData = await accedoOneFetchHelper({
    endpointType: 'profile',
    sessionKey
  });
  const { profileId } = profileData || {};

  return profileId;
};

const accedoOneConfigMiddleware = async (req, res) => {
  const { cookies } = req;
  const sessionKey = cookies[SESSION_KEY];

  const profileId = await getAccedoOneProfile(sessionKey);
  const { service } = (await getAccedoOneMetaData(sessionKey)) || {};

  res.setHeader(ACCEDO_ONE_PROFILE, profileId || '');
  res.setHeader(ACCEDO_ONE_SERVICE, service || '');
  res.sendStatus(200);
};

export const getAccedoOneSessionKeyForWebcrawler = async () => {
  const endpoint = `${ACCEDO_ONE_BASE_URL}/session?appKey=${appKey}&uuid=webcrawler`;

  try {
    const response = await fetch(endpoint);
    const sessionKey = await response.json();

    return sessionKey;
  } catch (error) {
    if (__DEVTOOLS__) {
      console.warn(`Accedo One error: ${error}`);
    }
  }
};

export default accedoOneConfigMiddleware;
