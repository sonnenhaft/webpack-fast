import winston from '@accedo/vdkweb-winston';
import AccedoOne from '@accedo/vdkweb-winston-accedo-one';
import config from '#/config';
import { getAccedoOneClient } from '#/services/accedoOne/accedoOne';

const logger = new winston.Logger();

// We have different log transports depending on if we're using the logger from
// the server or from the client.
// The global flag __CLIENT__ should only be true when requesting in a client side context.
const transports = __CLIENT__
  ? config.app.logger.transports
  : config.server.logger.transports;

// Configure the logger with the listed transports. Only add those that are enabled in config.
transports.forEach(transport => {
  if (!transport.enabled) {
    return;
  }

  if (transport.name === 'AccedoOne') {
    // Explicitly pass the Accedo One client
    // to make sure we reuse the same client across the app.
    logger.add(AccedoOne, {
      ...transport.options,
      client: getAccedoOneClient()
    });
  } else {
    logger.add(winston.transports[transport.name], transport.options);
  }
});

// Export the prepared logger instance
export default logger;
