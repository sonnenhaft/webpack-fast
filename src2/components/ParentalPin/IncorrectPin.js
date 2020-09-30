import React, { Fragment } from 'react';

import Button from '#/components/Button/Button';
import { WarningSign } from '#/components/Icons';

import {
  buttonControlsContainer,
  parentalPinContent,
  parentalPinHeading,
  warningSignIconContainer
} from './parentalPinOverlay.scss';

import {
  INCORRECT_PIN,
  PLEASE_TRY_AGAIN,
  REQUEST_NEW_PIN,
  TRY_AGAIN
} from '#/views/R21Pin/utils/constants';

const IncorrectPin = () => {
  return (
    <Fragment>
      <WarningSign iconContainer={warningSignIconContainer} />
      <span className={parentalPinHeading}>{INCORRECT_PIN}</span>
      <span className={parentalPinContent}>{PLEASE_TRY_AGAIN}</span>
      <div className={buttonControlsContainer}>
        <Button dark displayText={REQUEST_NEW_PIN} />
        <Button light displayText={TRY_AGAIN} />
      </div>
    </Fragment>
  );
};

export default IncorrectPin;
