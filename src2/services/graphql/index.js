/* eslint import/no-unresolved: 0 */

import { HttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import cookie from 'react-cookie';

import introspectionQueryResultData from './fragmentTypes.json';
import {
  ACCEDO_ONE_PROFILE,
  ACCEDO_ONE_SERVICE,
  SESSION_KEY
} from '#/config/accedoOne';

import { getAccedoOneConfig } from '#/services/fetchHelper';

const { ACCEDO_ONE_KEY, GRAPHQL_ENDPOINT } = __ENV_CONFIG__;

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const serverUrl = GRAPHQL_ENDPOINT;
export const getUrl = () => serverUrl;

let profileId;
let service;
const setContextLink = ({
  context,
  headers,
  profileId: contextProfileId,
  service: contextService
}) => ({
  uri: contextService,
  credentials: 'include',
  headers: {
    ...headers,
    'x-application-key': `${ACCEDO_ONE_KEY}_${contextProfileId}`,
    'x-application-session': cookie.load(SESSION_KEY)
  },
  ...context
});

const accedoOneConfigLink = setContext(async (_, { headers, ...context }) => {
  if (profileId && service) {
    return setContextLink({ context, headers, profileId, service });
  }

  const {
    [ACCEDO_ONE_PROFILE]: fetchedProfileId,
    [ACCEDO_ONE_SERVICE]: fetchedService
  } = await getAccedoOneConfig();
  profileId = fetchedProfileId;
  service = fetchedService;

  // service = 'https://api.dev.shh.accedo.tv/';
  return setContextLink({ context, headers, profileId, service });
});

const fallbackLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  headers: {
    'x-application-key': `${ACCEDO_ONE_KEY}_${cookie.load(ACCEDO_ONE_PROFILE)}`,
    'x-application-session': cookie.load(SESSION_KEY)
  }
});

const link = accedoOneConfigLink.concat(fallbackLink);

const cache = new InMemoryCache({ fragmentMatcher });

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
};

export const client = new ApolloClient({
  cache,
  defaultOptions,
  link
});
