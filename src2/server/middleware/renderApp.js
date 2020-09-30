import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createMemoryHistory as createHistory } from 'history';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { ApolloProvider } from '@apollo/react-hooks';

import modules from '#/redux/modules';
import logger from '#/utils/logger';
import routes from '#/config/routes';
import serverConfig from '#/config/server';
import { configureStore } from '#/redux/store';
import App from '#/containers/App/App';
import { getServerServices } from '#/services';
import { client } from '#/services/graphql';

import Html from '../Html';
import getDisableSSR from '../getDisableSSR';

import { getNewRelicScript } from './getNewRelicScript';
import { getMetaTagsForCrawlers } from './getMetaTags';

const getRootComponent = (store, req) => {
  const context = {};
  const content = (
    <StaticRouter location={req.url} context={context}>
      {renderRoutes(routes)}
    </StaticRouter>
  );

  return (
    <ApolloProvider client={client}>
      <App store={store} content={content} />
    </ApolloProvider>
  );
};

/**
 * When rendering the application server side, it's not enough to render the App component.
 * We also need to create the surrounding HTML.
 *
 * @param  {ReduxStore} store      The Redux store
 * @param  {Object}     req        Express request object
 * @param  {boolean}    disableSSR When true the app will be rendered in the client
 * @return {String}                The entire HTML document (including the Redux store data) as a string
 */
const renderHtml = async (store, req, disableSSR) => {
  const component = disableSSR ? null : getRootComponent(store, req);
  const assets = __SERVER_ASSETS__;

  const newRelicScript = getNewRelicScript(req);

  const metaTags = await getMetaTagsForCrawlers(req);

  const html = ReactDOMServer.renderToString(
    <Html
      assets={assets}
      component={component}
      metaTags={metaTags}
      newRelicScript={newRelicScript}
      store={store}
    />
  );

  return `<!doctype html>\n${html}`;
};

const renderApp = async (req, res) => {
  const memoryHistory = createHistory(req.originalUrl);

  if (serverConfig.routesCacheValue) {
    res.set('Cache-Control', serverConfig.routesCacheValue);
  }

  const { store } = configureStore({
    historyType: memoryHistory,
    initialState: undefined,
    services: getServerServices(res)
  });

  global.navigator = {
    userAgent: req.headers['user-agent']
  };

  const disableSSR = getDisableSSR({ req });

  const completeRequest = async () => {
    const html = await renderHtml(store, req, disableSSR);
    res.status(200);
    res.send(html);
  };

  if (disableSSR) {
    completeRequest();

    return Promise.resolve();
  }

  const getBasicSsrInfo = async () => {
    const { status, config } = modules;
    const bindDispatch = fn => (...args) => store.dispatch(fn(...args));

    const getStatus = bindDispatch(status.actions.getData);
    const getConfig = bindDispatch(config.actions.getData);

    await getStatus();
    await getConfig();
  };

  const branches = matchRoutes(routes, req.url);

  const branchDataPromises = branches.map(({ route, match }) => {
    return route.component.fetchData instanceof Function
      ? route.component.fetchData({ params: match.params, store })
      : null;
  });

  await getBasicSsrInfo();
  try {
    await Promise.all(branchDataPromises);
    completeRequest();
  } catch (err) {
    logger.warn(err);
  }
};

export default renderApp;
