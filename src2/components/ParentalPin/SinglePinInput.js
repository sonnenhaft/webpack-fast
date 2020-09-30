import React from 'react';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';
import { KEYBOARD_EVENTS } from '#/utils/keyboardEvents';
import { parentalPinSingleInput } from './parentalPinOverlay.scss';

const singlePinInputChange = ({
  onInputChange,
  pinIndex,
  singlePinValue,
  target
}) => {
  const inputString = target.value.toString();
  if (inputString) {
    if (inputString.length > 1) {
      target.value = inputString.replace(singlePinValue, '');
    }
    onInputChange({
      indexChange: 1,
      pinIndex,
      value: target.value
    });
  }
};

const onKeyDownHandler = ({ event, onInputChange, pinIndex }) => {
  const { key, target } = event;

  switch (key) {
    case KEYBOARD_EVENTS.ARROW_DOWN:
    case KEYBOARD_EVENTS.ARROW_UP:
      event.preventDefault();
      break;
    case KEYBOARD_EVENTS.ARROW_LEFT:
      onInputChange({ indexChange: -1, pinIndex });
      break;
    case KEYBOARD_EVENTS.ARROW_RIGHT:
      onInputChange({ indexChange: 1, pinIndex });
      break;
    case KEYBOARD_EVENTS.BACKSPACE:
      if (!target.value) {
        onInputChange({ indexChange: -1, pinIndex });
      }
      break;
    default:
      noop();
  }
};

const SinglePinInput = ({
  inputEl,
  onInputChange,
  pinIndex,
  singlePinValue
}) => (
  <div className={parentalPinSingleInput}>
    <input
      type="number"
      onChange={({ target }) =>
        singlePinInputChange({
          onInputChange,
          pinIndex,
          singlePinValue,
          target
        })
      }
      onKeyDown={event =>
        onKeyDownHandler({ event, onInputChange, pinIndex, singlePinValue })
      }
      ref={inputEl}
    />
  </div>
);

SinglePinInput.propTypes = {
  inputEl: PropTypes.object,
  onInputChange: PropTypes.func,
  pinIndex: PropTypes.number,
  singlePinValue: PropTypes.string
};

export default SinglePinInput;
