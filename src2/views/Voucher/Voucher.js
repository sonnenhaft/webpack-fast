import React, { useContext, useEffect, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';
import { usePureState } from '#/utils/hooks';
import { ConfigContext } from '#/utils/context';

import { TextInput } from '#/components/Input';
import Modal from '#/components/Modal/Modal';
import PageTitle from '#/components/PageTitle/PageTitle';
import SubSection from '#/components/SubSection/SubSection';
import Spinner from '#/components/Spinner/Spinner';

import { useVoucherRedeem } from './useVoucherRedeem';
import {
  pageTitle,
  voucherInput,
  redeemButton,
  voucherSpinner
} from './voucher.scss';

const REDEEM_VOUCHER = 'redeemVoucherText';
const REDEEM_BTN = 'voucherRedeemBtn';
const VOUCHER_CODE = 'voucherCode_web';
const INVALID_TITLE = 'voucherInvalidCodePopupTitle';
const INVALID_SUBTITLE = 'voucherInvalidCodePopupDescription';
const CANCEL = 'voucherInvalidCodePopupCancelBtn';
const RE_ENTER = 'voucherInvalidCodePopupActiveBtn';
const SUCCESS_TITLE = 'redeemVoucherSuccessMessage';
const SUCCESS_BTN = 'redeemVoucherDone';

const initialState = {
  voucherCode: '',
  showModal: false
};

const VOUCHER_CODE_STR = 'Voucher code';

const Voucher = ({ history = { push: noop } }) => {
  const prevLoadingRef = useRef(null);
  const { messages = {} } = useContext(ConfigContext);
  const { state, setState } = usePureState(initialState);
  const { voucherCode, showModal } = state;

  const { redeemVoucher, error, loading, message } = useVoucherRedeem(
    voucherCode.trim()
  );

  const setVoucherCode = (voucherText = '') =>
    setState({ voucherCode: voucherText });

  const getMessage = key => messages[key] || '';

  const toggleModal = () => setState({ showModal: !showModal });

  const exitPage = () => {
    if (history?.action === 'PUSH') {
      history.goBack();

      return;
    }

    history.push('/');
  };

  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      toggleModal();
    }

    prevLoadingRef.current = loading;
  }, [error, loading]);

  const sectionProps = {
    ...(!loading && { buttonText: REDEEM_BTN }),
    buttonClassName: redeemButton,
    buttonDisabled: voucherCode.length < 1,
    onClick: redeemVoucher
  };

  const modalProps = {
    showModal,
    toggleModal,
    buttonProps: !error
      ? [{ displayText: SUCCESS_BTN, onClick: exitPage }]
      : [
          { displayText: CANCEL, onClick: exitPage },
          {
            displayText: RE_ENTER,
            onClick: noop
          }
        ],
    title: error ? INVALID_TITLE : SUCCESS_TITLE,
    iconType: error ? 'warning' : 'success',
    onModalClose: error ? noop : exitPage,
    ...(error ? { subtitle: INVALID_SUBTITLE } : { subtitleText: message })
  };

  return (
    <Fragment>
      <div>
        <PageTitle text={getMessage(REDEEM_VOUCHER)} className={pageTitle} />
        <SubSection {...sectionProps}>
          {loading ? (
            <Spinner className={voucherSpinner} />
          ) : (
            <TextInput
              placeholder={getMessage(VOUCHER_CODE) || VOUCHER_CODE_STR}
              value={voucherCode}
              onChange={setVoucherCode}
              className={voucherInput}
            />
          )}
        </SubSection>
      </div>
      <Modal {...modalProps} />
    </Fragment>
  );
};

Voucher.propTypes = {
  history: PropTypes.object
};

export default Voucher;
