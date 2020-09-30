import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { CheckboxTick, CheckboxGreen } from '#/components/Icons';

import { noop } from '#/helpers';

import {
  checkbox,
  tickIconContainer,
  inputCheckboxGreen
} from './checkbox.scss';

const TYPE = {
  BOX: 'box',
  TICK: 'tick'
};

const Checkbox = ({
  caption,
  disabled,
  checked,
  onChange,
  type,
  className,
  checkboxId
}) => {
  const isBoxType = type === TYPE.BOX;

  const CheckedIcon = isBoxType ? CheckboxGreen : CheckboxTick;

  return (
    <div
      className={classnames(checkbox, {
        [className]: Boolean(className),
        [inputCheckboxGreen]: isBoxType
      })}
    >
      <input
        disabled={disabled}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={checkboxId}>{caption}</label>
      <CheckedIcon iconContainer={tickIconContainer} />
    </div>
  );
};

Checkbox.propTypes = {
  caption: PropTypes.string,
  checked: PropTypes.bool,
  checkboxId: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(Object.values(TYPE))
};

Checkbox.defaultProps = {
  caption: '',
  checked: false,
  checkboxId: 'check-box',
  disabled: false,
  onChange: noop,
  type: TYPE.BOX
};

export default Checkbox;
