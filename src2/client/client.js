/**
 * The client side entry where the app is being rendered
 * to the selected DOM element.
 *
 * Allowing for hot module replacement in DEVELOPMENT mode.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { ApolloProvider } from '@apollo/react-hooks';

import historyConfig from '#/config/history';
import App from '#/containers/App/App';
import { configureStore } from '#/redux/store';
import { getClientServices } from '#/services';
import { client } from '#/services/graphql';

const { appHistory, Router } = historyConfig;

// require('./addWhyDidYouRender').default(); // NOSONAR

// Get hold of the redux store and history manager
const { store } = configureStore({
  historyType: appHistory,
  initialState: undefined,
  services: getClientServices()
});

// The app render function which will mount the application's
// component tree to the DOM node with id 'root'.
const render = () => {
  // Need to require these on the fly for HMR to work.
  const routes = require('#/config/routes').default;

  const mountNode = document.getElementById('root');
  const router = <Router>{renderRoutes(routes)}</Router>;
  const method = window.__ssr ? 'hydrate' : 'render';

  const appComponentWithApolloWrapper = (
    <ApolloProvider client={client}>
      <App store={store} content={router} />
    </ApolloProvider>
  );

  ReactDOM[method](appComponentWithApolloWrapper, mountNode);
};

// If we're in dev mode we'll allow for hot reloading of the
// application whenever any module below our 'routes' module is changing.
if (__LOCAL__ && module.hot) {
  module.hot.accept('#/config/routes', render);
}

// Render the component tree to the DOM
// unless it is a test run.
if (__TEST__) {
  module.exports = render;
} else {
  render();
}
