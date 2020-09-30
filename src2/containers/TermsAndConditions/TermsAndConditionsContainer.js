import React, { Fragment, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { ConfigContext } from '#/utils/context';
import OverlayComponent from '#/components/Overlay/OverlayComponent';
import TermsAndConditionsOverlay from '#/components/TermsAndConditions/TermsAndConditionsOverlay';
import ExternalLink from '#/components/ExternalLink/ExternalLink';

import {
  customDimension,
  termsAndConditionsLink
} from './termsAndConditionsContainer.scss';

const TermsAndConditionsContainer = ({
  acknowledgeText,
  declarationText,
  tAndCText,
  textStyle
}) => {
  const [isOverlayOpen, setOverlayState] = useState(false);
  const toggleOverlayState = () => setOverlayState(!isOverlayOpen);
  const {
    messages: { termsAndConditionText },
    termsAndConditionLink
  } = useContext(ConfigContext);

  return (
    <Fragment>
      <div className={textStyle}>
        {`${declarationText} `}
        <ExternalLink
          className={termsAndConditionsLink}
          displayText={termsAndConditionText}
          href={termsAndConditionLink}
        />
      </div>
      <OverlayComponent
        isOverlayOpen={isOverlayOpen}
        customDimension={customDimension}
        toggleOverlayState={toggleOverlayState}
      >
        <TermsAndConditionsOverlay
          acknowledgeText={acknowledgeText}
          tAndCText={tAndCText}
          toggleOverlayState={toggleOverlayState}
        />
      </OverlayComponent>
    </Fragment>
  );
};

TermsAndConditionsContainer.propTypes = {
  acknowledgeText: PropTypes.string,
  declarationText: PropTypes.string,
  tAndCText: PropTypes.string,
  textStyle: PropTypes.string
};

export default TermsAndConditionsContainer;
