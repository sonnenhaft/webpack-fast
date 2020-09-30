import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ParentalPinInput from './ParentalPinInput';

import {
  parentalPinContent,
  parentalPinHeading
} from './parentalPinOverlay.scss';

const ParentalPinOverlay = ({ currentPin, pinChange }) => (
  <Fragment>
    <span className={parentalPinHeading}>Enter parental control PIN</span>
    <span className={parentalPinContent}>
      Please enter PIN to watch / purchase content. Default PIN is 000000.
    </span>
    <ParentalPinInput currentPin={currentPin} pinChange={pinChange} />
  </Fragment>
);

ParentalPinOverlay.propTypes = {
  currentPin: PropTypes.array,
  pinChange: PropTypes.func
};

export default ParentalPinOverlay;
