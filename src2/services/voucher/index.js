import { useRefreshMutation } from '#/services/graphql/refreshHooks';

import redeemVoucher from './redeemVoucher.graphql';

export const useRedeemVoucher = ({ voucherCode, headers = {}, ...rest } = {}) =>
  useRefreshMutation({
    gql: redeemVoucher,
    variables: {
      voucherCode
    },
    context: {
      headers
    },
    ...rest
  });
