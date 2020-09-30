import {
  useLazyQuery,
  useQueryWithVariables
} from '#/services/graphql/useUncachedQuery';
import EPG_GQL_QUERY from './epgQuery.graphql';
import EPG_FILTERED_GQL_QUERY from './epgFilteredQuery.graphql';
import EPG_DETAILS_GQL_QUERY from './epgDetailsQuery.graphql';
import EPG_CURRENT_DETAILS_GQL_QUERY from './epgCurrentDetailsQuery.graphql';

export const useRetrieveEpg = () =>
  useQueryWithVariables({
    gql: EPG_GQL_QUERY,
    variables: {
      hoursBackward: 24,
      hoursForward: 24,
      programsByDate: false
    },
    errorPolicy: 'all'
  });

export const useRetrieveFilteredEpg = () =>
  useLazyQuery({
    gql: EPG_FILTERED_GQL_QUERY,
    errorPolicy: 'all'
  });

export const useEpgAssetDetails = () =>
  useLazyQuery({
    gql: EPG_DETAILS_GQL_QUERY
  });

export const useEpgCurrentAssetDetails = () =>
  useLazyQuery({
    gql: EPG_CURRENT_DETAILS_GQL_QUERY
  });
