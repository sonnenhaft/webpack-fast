import React from 'react';
import PropTypes from 'prop-types';

import PageTitle from '#/components/PageTitle/PageTitle';

import { comingSoonPageTitle, pageContent } from '../views.scss';

const ToBeImplemented = ({ messages = {} }) => {
  const { comingSoonDescription, comingSoonTitle } = messages;

  return (
    <div>
      <PageTitle className={comingSoonPageTitle} text={comingSoonTitle} />
      <div className={pageContent}>
        <p>{comingSoonDescription}</p>
      </div>
    </div>
  );
};

ToBeImplemented.propTypes = {
  messages: PropTypes.object
};

export default ToBeImplemented;
