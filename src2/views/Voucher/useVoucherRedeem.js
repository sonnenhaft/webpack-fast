import { useEffect, useState } from 'react';
import { createHeaders } from '#/helpers';
import { useRedeemVoucher } from '#/services/voucher';
import { useEntitlement } from '#/services/auth';
import { AuthContext } from '#/utils/context';
import { useDestructureFromAuthContext } from '#/helpers/hooks';

export const useVoucherRedeem = (voucherCode = '') => {
  const { nagraToken, ufinityToken } = useDestructureFromAuthContext(
    AuthContext
  );
  const { fetchEntitlement } = useEntitlement({
    nagraToken,
    ufinityToken
  });
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const messageStr = messages.length > 1 ? messages.join(', ') : messages[0];

  const [redeemVoucher, { data, error }] = useRedeemVoucher({
    voucherCode,
    headers: createHeaders({
      nagraToken,
      ufinityToken
    })
  });

  const { redeemVoucher: voucherResponse } = data || {};

  useEffect(() => {
    if (!voucherResponse && !error) {
      return;
    }

    setLoading(false);

    if (voucherResponse) {
      fetchEntitlement();
    }

    setMessages(
      (voucherResponse || []).reduce((acc, curr) => {
        const { name } = curr || {};

        return [...acc, name];
      }, [])
    );
  }, [voucherResponse, error]);

  return {
    redeemVoucher: () => {
      setLoading(true);
      redeemVoucher();
    },
    data,
    error,
    loading,
    message: messageStr || ''
  };
};
