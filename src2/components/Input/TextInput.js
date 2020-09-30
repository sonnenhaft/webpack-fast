import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import { noop } from '#/helpers';

import ClearButton from './ClearButton';
import styles from './textInput.scss';

const {
  floatingPlaceholder,
  input,
  inputContainer,
  initialPlaceholder
} = styles;

const TextInput = ({
  value,
  className,
  onChange,
  password,
  placeholder,
  transparent,
  isInvalid,
  invalidText,
  toggleInvalid,
  onInputFocus,
  onInputBlur,
  onClearPress,
  showClearButton,
  ...rest
}) => {
  const [focus, setFocus] = useState(false);
  const { length } = value || '';
  const isEmpty = length < 1;
  const placeHolderStyle =
    isEmpty && !focus ? initialPlaceholder : floatingPlaceholder;
  const noBackground = !isEmpty && !focus && styles.backgroundNone;

  const onBlur = () => {
    onInputBlur();
    setFocus(false);
  };

  const onFocus = () => {
    setFocus(true);
    onInputFocus();
    toggleInvalid();
  };

  const onInputChange = ({ target: { value: newValue = '' } }) =>
    onChange(newValue);

  const clearText = () => {
    onChange('');
    toggleInvalid();
  };

  const classes = classnames(inputContainer, {
    [styles.invalid]: isInvalid,
    [className]: Boolean(className)
  });

  return (
    <div className={classes} onFocus={onFocus} onBlur={onBlur}>
      <input
        className={classnames(input, { [noBackground]: transparent })}
        type={password ? 'password' : ''}
        value={value}
        onChange={onInputChange}
        autoComplete="off"
        {...rest}
      />
      <span className={placeHolderStyle}>{placeholder}</span>
      {!isEmpty && showClearButton() && (
        <ClearButton
          onClick={onClearPress || clearText}
          containerStyle={styles.clearButton}
          iconStyle={styles.clearIcon}
        />
      )}
      <span
        className={classnames(styles.invalidText, {
          [styles.hidden]: !isInvalid
        })}
      >
        {invalidText}
      </span>
    </div>
  );
};

TextInput.propTypes = {
  className: PropTypes.string,
  isInvalid: PropTypes.bool,
  invalidText: PropTypes.string,
  onChange: PropTypes.func,
  onInputFocus: PropTypes.func,
  onInputBlur: PropTypes.func,
  onClearPress: PropTypes.func,
  showClearButton: PropTypes.func,
  password: PropTypes.bool,
  placeholder: PropTypes.string,
  toggleInvalid: PropTypes.func,
  transparent: PropTypes.bool,
  value: PropTypes.string
};

TextInput.defaultProps = {
  className: '',
  isInvalid: false,
  invalidText: 'invalid input',
  onChange: noop,
  showClearButton: () => true,
  onInputFocus: noop,
  onInputBlur: noop,
  password: false,
  placeholder: '',
  toggleInvalid: noop,
  transparent: false,
  value: ''
};

export default TextInput;
