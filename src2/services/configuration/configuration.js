import config from '#/config';

/**
 * sample service:
 * export const get = () => config.app;
 */

// use accedo one as configuration service
export const getAccedoOneService = accedoOneClient => ({
  get: () => {
    return Promise.all([
      accedoOneClient.getAllMetadata(),
      accedoOneClient.getAllAssets()
    ])
      .then(async ([metadata, assets]) => {
        return {
          ...config.app,
          accedoOne: {
            ...metadata,
            assets
          }
        };
      })
      .catch(() => {
        return config.app;
      });
  }
});
