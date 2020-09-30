import { noop, getErrorCodeAndMessage } from '#/helpers';
import { MODAL_ICON_TYPE } from '#/constants';

const { success, warning } = MODAL_ICON_TYPE;

const PURCHASE_FAIL_BUTTON = 'tryAgainText';
const PURCHASE_FAIL_DESCRIPTION = 'tryAgainText';
const PURCHASE_FAIL_TITLE = 'purchaseFailurePopupTitleATV';
const PURCHASE_SUCCESS_BUTTON = 'ok';
const PURCHASE_SUCCESS_DESCRIPTION = 'purchaseSuccessfulPopupDescription';
const PURCHASE_SUCCESS_TITLE = 'purchaseSuccessfulPopupTitle';

export const purchaseModalProps = ({
  isSuccess,
  messages = {},
  purchasedContent,
  error
}) => {
  const { code = '', message = '' } = getErrorCodeAndMessage(error);

  const purchaseFailedText =
    (code && message && `${code} - ${message}`) ||
    messages[PURCHASE_FAIL_DESCRIPTION];

  return {
    buttonProps: [
      {
        displayText: isSuccess ? PURCHASE_SUCCESS_BUTTON : PURCHASE_FAIL_BUTTON,
        onClick: noop
      }
    ],
    iconType: isSuccess ? success : warning,
    subtitleText: isSuccess
      ? `${purchasedContent}${messages[PURCHASE_SUCCESS_DESCRIPTION]}`
      : purchaseFailedText,
    title: isSuccess ? PURCHASE_SUCCESS_TITLE : PURCHASE_FAIL_TITLE
  };
};
