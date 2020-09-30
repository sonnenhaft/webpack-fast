/*
 *** SERVER CONFIGURATIONS ***
 *
 *  Configurations for the Node server.
 */

import env from './env';

const staticPath =
  process.env.STATIC_PATH || (env.isProduction ? 'static' : '../static');

export default {
  // The path to serve static content from.
  staticPath,

  // The host name to use for the Node server
  host: process.env.HOST || 'localhost',

  // The port to start the Node server on
  port: process.env.PORT || 3000,

  // Indicates whether server-side rendering should be disabled or not.
  // I.e. if the React component tree should be hydrated server side or
  // only when loaded on the client.
  // Server side rendering helps with SEO and can speed up first load.
  disableSSR: false,

  // When SSR is enabled, the pages can't be cached to correctly create a new
  // Accedo One session if necessary. However, the files will still use cache.
  // When leaving it empty it will use the default by the CDN. For no cache you
  // can set it to `'no-cache'`.
  routesCacheValue: 'no-cache',

  // If we need an HTTP proxy to use for our client app, it can
  // be configured here. The below will proxy any call to
  // <server-url>/ovp to https://vdk-ovp.ocs.demo.accedo.tv
  //
  // Using a proxy can e.g. be an alternative in dev mode when you're not
  // in control of CORS settings on the server.
  // It can also be necessary if you need to attach confidential information
  // such as API tokens to OVP requests without exposing them to the client.
  //
  // Checkout src/server/middleware/proxy.js for hooking in to the request/response
  // chain of proxy requests.

  // Settings for the server side logger.
  // These will be passed to the server side @accedo/vdkweb-winston
  // logger in src/utils/logger.js
  logger: {
    // Defines the logging targets that we want to log
    // to whenever we're using the logger.
    transports: [
      // Logging to the console
      {
        name: 'Console',
        enabled: true
      }
    ]
  }
};
