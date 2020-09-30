import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { usePureState } from '#/utils/hooks';
import { NUM_REGEX, PIN_LENGTH, BACKSPACE, ASTERISK } from '#/constants';
import { ConfigContext } from '#/utils/context';
import { noop } from '#/helpers';
import { getAndroidBrowser, PLATFORM } from '#/utils/getPlatform';

import {
  pinInputContainer,
  singleInput,
  singleInputError,
  singleInputBase,
  singleInputContainer,
  pinInputErrorMessage,
  pinInputErrorHidden
} from './pinInput.scss';

const isAndroidChromeBrowser = getAndroidBrowser() === PLATFORM.chrome;

const initialState = {
  value: '',
  actual: ''
};

const getMaskedChar = (masked, value) => (masked ? ASTERISK : value);

const removeKeys = (props = {}) => {
  const { actual, setState, ...rest } = props;

  return { ...rest };
};

const assemblePinString = (inputList = []) =>
  inputList.reduce((acc, curr) => `${acc}${curr?.actual || ''}`, '');

const setPinString = (inputList, masked, pin = '') => {
  const pinValues = pin.split('');
  inputList.forEach(({ setState = noop } = {}, index) => {
    const actual = pinValues[index] || '';

    setState({ value: actual ? getMaskedChar(masked, actual) : '', actual });
  });
};

const onKeyDown = ({ refList = [], index, masked } = {}) => ({
  target,
  key
} = {}) => {
  const { value } = target || {};
  const keyInput = key || value;
  const isBackSpace = keyInput === BACKSPACE;
  const next = isBackSpace ? index - 1 : index + 1;
  const { ref: { current } = {}, setState: setNextState = noop } =
    refList[next] || {};
  const {
    state: { value: currentValue },
    setState
  } = refList[index] || {};

  if (isBackSpace) {
    setState(initialState);

    current?.focus();

    return;
  }

  if (!NUM_REGEX.test(keyInput) || !keyInput) {
    return;
  }

  const setInputState = !currentValue ? setState : setNextState;

  setInputState({ value: getMaskedChar(masked, keyInput), actual: keyInput });

  current?.focus();
};

const PinInput = ({
  className,
  errorMessage,
  pin,
  focusOnMount = true,
  error = false,
  pinLength = PIN_LENGTH,
  masked = false,
  onChange = noop,
  innerClassName
}) => {
  const { messages } = useContext(ConfigContext);
  const baseArray = Array(pinLength).fill();

  const refList = baseArray.map(() => ({
    ref: useRef(null),
    ...usePureState(initialState)
  }));

  useEffect(() => {
    if (focusOnMount) {
      const { ref: { current } = {} } = refList[0];
      // without timeout focus not applied on next episode
      setTimeout(() => current?.focus(), 0);
    }
  }, []);

  const inputPropList = baseArray.map((_, index) => {
    const { state, setState } = refList[index] || {};

    return {
      ...state,
      setState,
      onKeyDown: onKeyDown({
        refList,
        index,
        masked
      }),
      onChange: isAndroidChromeBrowser
        ? onKeyDown({
            refList,
            index,
            masked
          })
        : noop
    };
  });

  const inputString = assemblePinString(inputPropList);

  useEffect(() => {
    onChange(inputString);

    if (inputString.length === pinLength) {
      document?.activeElement?.blur();
    }
  }, [inputString.length]);

  useEffect(() => {
    if (pin.length !== inputString.length) {
      setPinString(inputPropList, masked, pin);
    }
  }, [pin]);

  return (
    <div
      className={classnames(pinInputContainer, {
        [className]: Boolean(className)
      })}
    >
      <div className={innerClassName || singleInputContainer}>
        {refList.map(({ ref }, index) => (
          <input
            className={classnames(
              singleInput,
              error ? singleInputError : singleInputBase
            )}
            key={`pin-${index}`}
            ref={ref}
            {...removeKeys(inputPropList[index])}
          />
        ))}
      </div>
      <div
        className={classnames(pinInputErrorMessage, {
          [pinInputErrorHidden]: !error
        })}
      >
        {messages[errorMessage] || 'Invalid pin'}
      </div>
    </div>
  );
};

PinInput.propTypes = {
  className: PropTypes.string,
  pin: PropTypes.string,
  masked: PropTypes.bool,
  focusOnMount: PropTypes.bool,
  pinLength: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  innerClassName: PropTypes.string,
  onChange: PropTypes.func
};

export default PinInput;
