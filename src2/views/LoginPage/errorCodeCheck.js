import { LOGIN_ERROR_CODES } from '#/constants';

const {
  deviceDeletedError,
  deviceLimitReachedError,
  accountSuspendedError
} = LOGIN_ERROR_CODES;

const getErrorCode = error => {
  const { graphQLErrors } = error || {};
  const [{ code } = {}] = graphQLErrors || [];

  return code;
};

export const isClientIdDeletedCheck = error =>
  deviceDeletedError.includes(getErrorCode(error));

export const isDeviceLimitReachedCheck = error =>
  deviceLimitReachedError.includes(getErrorCode(error));

export const isAccountSuspended = error =>
  accountSuspendedError.includes(getErrorCode(error));
