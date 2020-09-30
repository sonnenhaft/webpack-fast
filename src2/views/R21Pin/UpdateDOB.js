import React, { useState } from 'react';
import moment from 'moment-mini';
import PropTypes from 'prop-types';

import { noop } from '#/helpers';

import {
  STEP_2_ENTER_DOB,
  PLEASE_ENTER_DOB,
  DOB_BUTTON,
  SCREEN
} from './utils/constants';

import DateInput from '#/components/Input/DateInput';
import SubSection from '#/components/SubSection/SubSection';

import { dobButton } from './r21-pin.scss';

const dateFormat = 'DDMMYYYY';

const UpdateDOB = ({ setScreen = noop }) => {
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState('');

  const onClick = () => {
    const currentTime = moment();
    const birthDate = moment(value.replace('-', ''), dateFormat);
    const years = currentTime.diff(birthDate, 'years');

    setScreen({ screen: years >= 21 ? SCREEN.SET_R21_PIN : null });
  };

  const subProps = {
    title: STEP_2_ENTER_DOB,
    subtitle: PLEASE_ENTER_DOB,
    buttonClassName: dobButton,
    buttonText: DOB_BUTTON,
    buttonType: 'light',
    buttonDisabled: disabled,
    onClick
  };

  return (
    <SubSection {...subProps}>
      <DateInput
        value={value}
        setValue={setValue}
        setDateInputValid={isValid => {
          setDisabled(!isValid);
        }}
      />
    </SubSection>
  );
};

UpdateDOB.propTypes = {
  setScreen: PropTypes.func,
  setModalProps: PropTypes.func,
  toggleModal: PropTypes.func
};

export default UpdateDOB;
