import useragent from 'useragent';

import config from '#/config';
import logger from '#/utils/logger';

const getDisableSSR = ({ req }) => {
  if (config.server.disableSSR === false) {
    return false;
  }

  const agent = useragent.parse(req.headers['user-agent']);
  const device = agent.device.toJSON();

  if (device.family === 'Spider' && !config.server.disableSSR) {
    logger.debug(
      `Enabling Server Side Rendering due to spider bot: ${
        req.headers['user-agent']
      }`
    );

    return false;
  }

  return true;
};

export default getDisableSSR;
