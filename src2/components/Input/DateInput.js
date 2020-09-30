import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';
import { TextInput } from '#/components/Input';

import { NUM_REGEX, BACKSPACE } from '#/constants';

import { dobInput } from './textInput.scss';

const INVALID_TEXT = 'Please input a valid date';
const DATE_PLACEHOLDER = 'DD-MM-YYYY';
const DATE_REGEX = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[-]([0]?[1-9]|[1][0-2])[-]((19|20)[0-9]{2})$/;

const onKeyDown = ({ key } = {}, baseValue, formatDate = noop) => {
  const { length } = baseValue;

  if (key === BACKSPACE) {
    formatDate(baseValue.slice(0, -1));

    return;
  }

  if (length >= 10 || !NUM_REGEX.test(key)) {
    return;
  }

  switch (length) {
    case 2:
    case 5:
      formatDate(`${baseValue}-${key}`);
      break;
    default:
      formatDate(baseValue + key);
      break;
  }
};

const DateInput = ({ value, setValue = noop, setDateInputValid = noop }) => {
  const [baseValue, setBaseValue] = useState('');
  const inputEnded = baseValue.length === 10;
  const isValidDate = DATE_REGEX.test(baseValue);

  const onFocus = () => {
    if (baseValue.length < 1) {
      setValue(DATE_PLACEHOLDER);
    }
  };
  const onClearPress = () => {
    setValue('');
    setBaseValue('');
  };

  const onInputBlur = () => {
    if (baseValue.length < 1) {
      onClearPress();
    }
  };

  const formatDate = inputStr => {
    setBaseValue(inputStr);

    setValue(inputStr + DATE_PLACEHOLDER.slice(inputStr.length));
  };

  setDateInputValid(inputEnded && isValidDate);

  return (
    <TextInput
      isInvalid={inputEnded && !isValidDate}
      value={value}
      className={dobInput}
      placeholder={DATE_PLACEHOLDER}
      invalidText={INVALID_TEXT}
      onKeyDown={e => onKeyDown(e, baseValue, formatDate)}
      onInputFocus={onFocus}
      onInputBlur={onInputBlur}
      onClearPress={onClearPress}
      showClearButton={() => baseValue.length > 0}
    />
  );
};

DateInput.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  setDateInputValid: PropTypes.func
};

export default DateInput;
