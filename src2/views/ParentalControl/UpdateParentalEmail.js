import React from 'react';
import PropTypes from 'prop-types';

import UpdateEmailSection from '#/components/UpdateEmailSection/UpdateEmailSection';

import { SCREEN } from './constants';

const UpdateParentalEmail = ({ setScreen, ...rest }) => {
  return (
    <UpdateEmailSection
      {...rest}
      onEmailUpdateComplete={() =>
        setScreen({ screen: SCREEN.SET_PIN_RESET_EMAIL })
      }
    />
  );
};

UpdateParentalEmail.propTypes = {
  setScreen: PropTypes.func
};

export default UpdateParentalEmail;
