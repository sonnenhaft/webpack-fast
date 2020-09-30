import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';

import { radioButtonContainer, selectedRadioButton } from './radioButton.scss';

const RadioButton = ({
  className,
  checked,
  onChange = noop,
  selectedClassName
}) => (
  <div
    className={classnames(radioButtonContainer, {
      [className]: Boolean(className)
    })}
  >
    <input type="radio" checked={checked} onChange={onChange} />
    <div
      className={classnames(selectedRadioButton, {
        [selectedClassName]: Boolean(selectedClassName)
      })}
    />
  </div>
);

RadioButton.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  selectedClassName: PropTypes.string
};

export default RadioButton;
