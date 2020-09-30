import { useUncachedQuery } from '#/services/graphql/useUncachedQuery';
import ACCEDO_ONE_NON_VIKIMAP_PAGES_GQL_QUERY from './nonVikimapPagesQuery.graphql';
import ACCEDO_ONE_CONFIG_GQL_QUERY from './accedoOneConfig.graphql';

export const useNonVikimapPages = () =>
  useUncachedQuery({ gql: ACCEDO_ONE_NON_VIKIMAP_PAGES_GQL_QUERY });

export const useAccedoOneConfig = () =>
  useUncachedQuery({ gql: ACCEDO_ONE_CONFIG_GQL_QUERY });
