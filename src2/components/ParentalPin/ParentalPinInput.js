import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';
import { PIN_LENGTH } from '#/constants';

import SinglePinInput from './SinglePinInput';

import { parentalPinFullInput } from './parentalPinOverlay.scss';

const ParentalPinInput = ({ currentPin = [], className, pinChange = noop }) => {
  const refList = Array(PIN_LENGTH)
    .fill()
    .map(() => useRef(null));
  const onInputChange = ({ indexChange, pinIndex, value }) => {
    if (pinIndex < refList.length - 1 || pinIndex > 0) {
      refList[pinIndex + indexChange]?.current.focus();
    }
    if (value) {
      pinChange({ pinIndex, value });

      return;
    }

    pinChange({ pinIndex: pinIndex - 1, value: undefined });
  };

  useEffect(() => {
    refList[0]?.current.focus();
  }, []);

  return (
    <div
      className={classnames(parentalPinFullInput, {
        [className]: Boolean(className)
      })}
    >
      {refList.map((ref, key) => (
        <SinglePinInput
          key={`parental-pin-${key}`}
          inputEl={ref}
          onInputChange={onInputChange}
          pinIndex={key}
          singlePinValue={currentPin[key]}
        />
      ))}
    </div>
  );
};

ParentalPinInput.propTypes = {
  className: PropTypes.string,
  currentPin: PropTypes.array,
  pinChange: PropTypes.func
};

export default ParentalPinInput;
