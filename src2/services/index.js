import * as ovp from '#/services/ovp';
import { useVikimapQuery } from '#/services/vikimap';
import {
  getAccedoOneClient,
  getAccedoOneServices
} from '#/services/accedoOne/accedoOne';

const getServices = accedoOneClient => {
  const accedoOneServices = getAccedoOneServices(accedoOneClient);

  return {
    ovp,
    vikimap: useVikimapQuery,
    configuration: accedoOneServices.configuration,
    status: accedoOneServices.status
  };
};

/**
 * Get the services that need to be used in redux on server side
 *
 * @param  {Object} res           The HTTP response object
 * @return {Object}               The services will be used in redux
 */
export const getServerServices = res => {
  return getServices(res.locals.accedoOneClient);
};

/**
 * Get the services that need to be used in redux on client side
 *
 * @return {Object}               The services will be used in redux
 */
export const getClientServices = () => {
  const accedoOneClient = getAccedoOneClient();

  return getServices(accedoOneClient);
};
