import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { renderRoutes } from 'react-router-config';
import { PlayerProvider } from '#/utils/context';

import styles from '../views.scss';

const { content, contentNoPadding } = styles;

const ViewContainerWithPlayerContext = ({
  epgCategories,
  history,
  messages,
  route,
  isSpecialRoute
}) => (
  <PlayerProvider>
    <div
      className={classnames(content, { [contentNoPadding]: isSpecialRoute })}
    >
      {renderRoutes(route.routes, { epgCategories, history, messages })}
    </div>
  </PlayerProvider>
);

ViewContainerWithPlayerContext.propTypes = {
  epgCategories: PropTypes.array,
  history: PropTypes.object,
  messages: PropTypes.object,
  route: PropTypes.object,
  isSpecialRoute: PropTypes.bool
};

export default ViewContainerWithPlayerContext;
