import './mocks';

import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import http from 'http';
import vikimapMiddleware from '@accedo/vdkweb-vikimap/lib/middleware';
import cookieParser from 'cookie-parser';

import logger from '#/utils/logger';
import config from '#/config';

import proxy from './middleware/proxy';
import renderError from './middleware/renderError';
import renderApp from './middleware/renderApp';
import accedoOneConfigMiddleware from './middleware/getAccedoOneConfig';
import accedoOneMiddlewareWrapper from './middleware/accedoOneMiddlewareWrapper';

const newRelic = require('newrelic');

const app = new Express();
const server = new http.Server(app);

const staticFolderPath = path.resolve(__dirname, './static');
const appleAppSiteAssociationPath = path.resolve(
  __dirname,
  './apple-app-site-association'
);
const robotsTxt = path.resolve(__dirname, './robots.txt');

app.locals.newRelic = newRelic;

/* Remove the 'X-Powered-By: Express' header */
app.disable('x-powered-by');

/* Compress response bodies for requests */
app.use(compression());

/* Populate cookies in the request object */
app.use(cookieParser());

/* Serve the favicon */
app.use(favicon(path.join(staticFolderPath, 'favicon.ico')));

/* Serve static files from the configured static folder */
app.use('/static', Express.static(staticFolderPath));

/* Serve apple app site association static file */
app.use(
  '/apple-app-site-association',
  Express.static(appleAppSiteAssociationPath)
);

/* Serve robots.txt static file */
app.use('/robots.txt', Express.static(robotsTxt));

/* Middleware to get profileId and metadata service field */
app.use('/health/config', accedoOneConfigMiddleware);

/* Handle a common health-check endpoint */
app.use('/health', (req, res) => {
  res.sendStatus(200);
});

/*
 * Make sure you have an Accedo One key configure if you want
 * to enable Accedo One and Vikimap middleware
 */
if (config.accedoOne.appKey) {
  /* Handle proxy servers if needed, to pass the user's IP instead of the proxy's */
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

  /* Use the Accedo One middleware to easily proxy calls to Accedo One */
  app.use(accedoOneMiddlewareWrapper());

  /* Vikimap middleware to handle entry fetching from Accedo One */
  app.use('/vikimap', vikimapMiddleware({ logger }));
}

if (config.server.proxies) {
  config.server.proxies.forEach(p => {
    app.use(proxy(p.path, p.url));
  });
}

/*
 * User friendly error message in production mode.
 */
if (config.isProduction) {
  app.use(renderError);
}

/*
 * Creates and renders the app HTML.
 * Retrieves the client assets (references to script files, css files, etc) first
 * and provides them to the renderApp middleware.
 */
app.use(renderApp);

if (config.server.port) {
  server.listen(config.server.port, config.server.host, err => {
    if (err) {
      logger.error(err);
    }
    logger.info(
      '----\n==> ✅  %s is running (production: %s)',
      config.app.title,
      config.env.isProduction
    );
    logger.info(
      '==> 💻  Open http://%s:%s in a browser to view the app.',
      config.server.host,
      config.server.port
    );
  });
} else {
  logger.error(
    '==>     ERROR: No PORT environment variable has been specified'
  );
}
