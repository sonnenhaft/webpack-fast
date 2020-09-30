import { useContext } from 'react';
import { createHeaders } from '#/helpers';
import { useLazyQuery } from '#/services/graphql/useUncachedQuery';
import { AuthContext } from '#/utils/context';
import SEARCH_QUERY from './searchQuery.graphql';

export const searchLazyQuery = keyword => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useLazyQuery({
    gql: SEARCH_QUERY,
    variables: {
      keyword
    },
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    }
  });
};
