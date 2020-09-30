import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '#/components/Button/Button';

import {
  termsAndConditionsButton,
  termsAndConditionsContent,
  termsAndConditionsHeading
} from './termsAndConditionsOverlay.scss';

const TermsAndConditionsOverlay = ({
  acknowledgeText,
  tAndCText = '',
  toggleOverlayState
}) => (
  <Fragment>
    <span className={termsAndConditionsHeading}>Terms &amp; conditions</span>
    <div className={termsAndConditionsContent}>{tAndCText}</div>
    <Button
      light
      className={termsAndConditionsButton}
      displayText={acknowledgeText}
      onClick={toggleOverlayState}
    />
  </Fragment>
);

TermsAndConditionsOverlay.propTypes = {
  acknowledgeText: PropTypes.string,
  tAndCText: PropTypes.string,
  toggleOverlayState: PropTypes.func
};

export default TermsAndConditionsOverlay;
