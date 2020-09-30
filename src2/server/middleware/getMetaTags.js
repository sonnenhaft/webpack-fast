import accedoOne from '#/config/accedoOne';
import {
  getAccedoOneMetaData,
  getAccedoOneProfile,
  getAccedoOneSessionKeyForWebcrawler
} from './getAccedoOneConfig';

import { ROUTE } from '#/constants';

const { LINEAR_DETAILS, MOVIE_DETAILS, PACK_DETAILS, SERIES_DETAILS } = ROUTE;

const accedoOnePagesQuery = `query webAccedoOnePages {
  accedoOne {
   pages {
    	pageData {
        id
        description
        displayText
        keywords
        title
        pageid
        _meta {
          entryAlias
        }
      }
  	} 
  }
}`;

const detailsQuery = `query webDetails($id: String!) {
  details(id: $id) {
    description
    displayText: title
    image
    ... on NagraChannel {
      channelName
      tvChannel
    }
  }
}`;

const middlewareFetchHelper = async ({
  appKey,
  endpoint,
  profileId,
  query,
  sessionKey,
  variables
}) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-application-session': sessionKey,
        'x-application-key': `${appKey}_${profileId}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const data = await response.json();

    return data;
  } catch (error) {
    if (__DEVTOOLS__) {
      console.warn(`${endpoint} middleware error: ${error}`);
    }
  }
};

const getMetadata = ({
  accedoOneData,
  detailsPageData,
  id,
  isCustomizedMetaTags
}) => {
  const modifiedId = isCustomizedMetaTags ? 'detail' : id;

  const { data: { accedoOne: { pages } = {} } = {} } = accedoOneData || {};
  const { pageData: filteredPageData } =
    (pages || [])?.find(({ pageData }) => {
      const { pageid, _meta: { entryAlias } = {} } = pageData || {};

      return pageid === modifiedId || entryAlias === modifiedId;
    }) || {};

  if (isCustomizedMetaTags) {
    const { data } = detailsPageData || {};
    const { details } = data || {};
    const { channelName, description, displayText, image, tvChannel } =
      details || {};
    const linearChannelDisplay = `Channel ${tvChannel} ${channelName}`;

    const { keywords } = filteredPageData || {};

    return {
      description: tvChannel ? linearChannelDisplay : description,
      displayText: tvChannel ? linearChannelDisplay : displayText,
      image,
      keywords
    };
  }

  return filteredPageData;
};

export const getMetaTagsForCrawlers = async req => {
  const { url } = req || {};

  const pathArray = url.split('/');
  const page = pathArray?.[1];
  const assetId = pathArray?.[pathArray?.length - 1];

  const pagesWithCustomizedMetaTags = [
    LINEAR_DETAILS,
    MOVIE_DETAILS,
    PACK_DETAILS,
    SERIES_DETAILS
  ];
  const isCustomizedMetaTags = pagesWithCustomizedMetaTags.some(customPage =>
    customPage.includes(page)
  );

  const { appKey } = accedoOne || {};

  const { sessionKey } =
    req.app.locals.crawlerSession ||
    (await getAccedoOneSessionKeyForWebcrawler());

  const [profileId, accedoOneMetaData] =
    (await Promise.all([
      getAccedoOneProfile(sessionKey),
      getAccedoOneMetaData(sessionKey)
    ])) || [];
  const { appName, service } = accedoOneMetaData || {};
  const queryParameters = {
    appKey,
    endpoint: service,
    profileId,
    sessionKey
  };

  const accedoOneFetch = () =>
    middlewareFetchHelper({
      query: accedoOnePagesQuery,
      ...queryParameters
    });
  const detailsFetch = () =>
    middlewareFetchHelper({
      query: detailsQuery,
      variables: { id: assetId },
      ...queryParameters
    });
  const data = isCustomizedMetaTags
    ? await Promise.all([detailsFetch(), accedoOneFetch()])
    : await accedoOneFetch();

  const metadata = getMetadata({
    accedoOneData: isCustomizedMetaTags ? data?.[1] : data,
    ...(isCustomizedMetaTags && { detailsPageData: data?.[0] }),
    isCustomizedMetaTags,
    id: isCustomizedMetaTags ? assetId : page
  });
  const { displayText, ...restMetaTags } = metadata || {};

  return {
    displayText: `${appName} | ${displayText}`,
    ...restMetaTags
  };
};
