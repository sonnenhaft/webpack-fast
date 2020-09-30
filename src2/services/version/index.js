import { useUncachedQuery } from '#/services/graphql/useUncachedQuery';
import VERSION_GQL_QUERY from './versionQuery.graphql';

export const loadVersionData = () =>
  useUncachedQuery({ gql: VERSION_GQL_QUERY });
