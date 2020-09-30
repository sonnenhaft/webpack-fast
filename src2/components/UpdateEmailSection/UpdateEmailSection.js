import React, { useEffect, Fragment, useContext } from 'react';
import PropTypes from 'prop-types';

import { ConfigContext } from '#/utils/context';
import { useLoadingComplete } from '#/utils/hooks';
import { useHasEmail } from '#/services/settings';

import { noop } from '#/helpers';

import { EXT_ROUTES } from '#/constants';

import SubSection from '#/components/SubSection/SubSection';

import {
  STEP_1_R21,
  STEP_1_PARENTAL,
  TRY_AGAIN,
  CONTINUE_TO_R21_PIN,
  CONTINUE_TO_PARENTAL_PIN,
  HUB_ID_NOT_UPDATED,
  UPDATE_ID_EMAIL,
  ONCE_UPDATED,
  CONTINUE,
  HUB_ID_EMAIL_FAILED,
  CHECK_HUB_ID
} from './constants';

import { stepCircle, stepLine, stepVisualizer } from './email-section.scss';

const StepVisualizer = () => (
  <div className={stepVisualizer}>
    <div className={stepCircle} />
    <div className={stepLine} />
    <div className={stepCircle} />
  </div>
);

const UpdateEmailSection = ({
  r21Pin = false,
  setModalProps = noop,
  toggleModal = noop,
  onEmailUpdateComplete = noop
}) => {
  const { r21EmailURL } = useContext(ConfigContext);
  const [checkHasEmail, { data, loading }] = useHasEmail();
  const subSectionItems = [
    {
      title: r21Pin ? STEP_1_R21 : STEP_1_PARENTAL,
      subtitle: HUB_ID_NOT_UPDATED,
      buttonText: UPDATE_ID_EMAIL,
      onClick: () => {
        if (__CLIENT__) {
          window.open(r21EmailURL || EXT_ROUTES.SIGN_UP, '_blank');
        }
      }
    },
    {
      title: r21Pin ? CONTINUE_TO_R21_PIN : CONTINUE_TO_PARENTAL_PIN,
      subtitle: ONCE_UPDATED,
      buttonText: CONTINUE,
      onClick: checkHasEmail
    }
  ];

  useLoadingComplete({
    loading,
    onComplete: () => {
      const { settings: { hasEmail } = {} } = data || {};

      if (!hasEmail) {
        toggleModal();

        return;
      }

      onEmailUpdateComplete();
    }
  });

  useEffect(() => {
    setModalProps({
      buttonProps: [{ displayText: TRY_AGAIN, onClick: noop }],
      title: HUB_ID_EMAIL_FAILED,
      subtitle: CHECK_HUB_ID,
      iconType: 'warning'
    });

    return () => setModalProps(null);
  }, []);

  return (
    <Fragment>
      {subSectionItems.map((props, key) => (
        <SubSection key={`section-${key}`} {...props} />
      ))}
      <StepVisualizer />
    </Fragment>
  );
};

UpdateEmailSection.propTypes = {
  setModalProps: PropTypes.func,
  toggleModal: PropTypes.func,
  onEmailUpdateComplete: PropTypes.func,
  r21Pin: PropTypes.bool
};

export default UpdateEmailSection;
