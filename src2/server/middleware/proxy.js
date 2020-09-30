import httpProxy from 'http-proxy-middleware';
import logger from '#/utils/logger';

const NOOP = () => {}; // NOSONAR

const proxy = (path, url, extraOpts = {}) => {
  return httpProxy(path, {
    target: url,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: '' },
    logProvider: () => logger,
    onProxyReq: NOOP,
    onProxyRes: NOOP,
    onError: error => {
      logger.error(`Error for proxy: ${path} (${url}): ${error}`, {
        dim1: 'proxy',
        facilityCode: 70,
        errorCode: 100
      });
    },
    ...extraOpts
  });
};

export default proxy;
