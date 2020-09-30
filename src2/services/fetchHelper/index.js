import fetch from '@accedo/vdkweb-fetch';
import { ACCEDO_ONE_PROFILE, ACCEDO_ONE_SERVICE } from '#/config/accedoOne';
import { ROUTE } from '#/constants';

const { CONFIG } = ROUTE;

const getHeaderFromFetchHelper = async (url, headers) => {
  try {
    const response = await fetch(url);
    const headersFromFetch = headers.reduce(
      (headerInfo, header) => ({
        ...headerInfo,
        [header]: response.headers.get(header)
      }),
      {}
    );

    return headersFromFetch;
  } catch (error) {
    if (__DEVTOOLS__ && __CLIENT__) {
      console.warn(`Fetch error: ${error}`);
    }
  }
};

export const getAccedoOneConfig = async () => {
  const accedoOneConfig = await getHeaderFromFetchHelper(CONFIG, [
    ACCEDO_ONE_PROFILE,
    ACCEDO_ONE_SERVICE
  ]);

  return accedoOneConfig;
};
