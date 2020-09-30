import env from './env';
import app from './app';
import server from './server';
import accedoOne from './accedoOne';
import * as templates from './templates';

/*
 * Exporting the aggregated configurations.
 */
export default {
  accedoOne,
  app,
  env,
  server,
  templates
};
