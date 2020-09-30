import { useContext } from 'react';
import { createHeaders } from '#/helpers';

import { AuthContext } from '#/utils/context';

import { useQueryWithVariables } from '#/services/graphql/useUncachedQuery';

import { useLazyRefreshQuery } from '#/services/graphql/refreshHooks';

import paymentTransactionQuery from './paymentTransactions.graphql';
import filterListDataQuery from './filterListData.graphql';

const PAGE_ID = 'more-transaction';

export const usePaymentTransactions = () => {
  const {
    state: {
      nagra: { token: nagraToken } = {},
      ufinity: { token: ufinityToken } = {}
    } = {}
  } = useContext(AuthContext);

  return useLazyRefreshQuery({
    gql: paymentTransactionQuery,
    context: {
      headers: createHeaders({
        nagraToken,
        ufinityToken
      })
    },
    notifyOnNetworkStatusChange: true
  });
};

export const useFilterList = () => {
  const { data: { page } = {}, loading } = useQueryWithVariables({
    gql: filterListDataQuery,
    variables: {
      pageid: PAGE_ID
    }
  });

  return { filters: page?.filterListData?.valueData, loading };
};
