import React, { useContext } from 'react';
import { ConfigContext } from '#/utils/context';
import viewStyles from '../views.scss';

export const NoMatch = () => {
  const { messages = {} } = useContext(ConfigContext);
  const {
    pageNotFoundErrorTitle = '',
    pageNotFoundErrorDescription = ''
  } = messages;

  return (
    <div className={viewStyles.pageContent}>
      <h1>{pageNotFoundErrorTitle}</h1>
      <p>{pageNotFoundErrorDescription}</p>
    </div>
  );
};

export default NoMatch;
