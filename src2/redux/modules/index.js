/*
 * Export the Redux modules that you would like to
 * use with state management.
 *
 * This will be used by redux/reducer.js to walkthrough
 * all registered modules and add root selectors to them for
 * providing the base state of each module.
 */

/* External modules */

import * as vikimap from '@accedo/vdkweb-vikimap/lib/redux';

/* Internal modules */

import * as config from './config';
import * as lifecycle from './lifecycle';
import * as menu from './menu';
import * as status from './status';
import * as vikimapQueries from './vikimapQueries';

export default {
  config,
  lifecycle,
  menu,
  status,
  vikimapQueries,
  vikimap
};
