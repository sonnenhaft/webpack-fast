import config from '#/config';

import { getAccedoOneService } from '../configuration';

describe('configuration', () => {
  it('returns the expected value when resolved', async () => {
    const mockAccedoOneClient = {
      getAllMetadata: () => {
        return Promise.resolve({ foo: 'bar' });
      },
      getAllAssets: () => {
        return Promise.resolve({ bam: 'baz' });
      }
    };
    const result = await getAccedoOneService(mockAccedoOneClient).get();

    expect(result).toEqual({
      ...config.app,
      accedoOne: {
        foo: 'bar',
        assets: {
          bam: 'baz'
        }
      }
    });
  });

  it('returns the expected value when rejected', async () => {
    const mockAccedoOneClient = {
      getAllMetadata: () => {
        return Promise.reject('remoteConfigValue');
      },
      getAllAssets: () => {
        return Promise.resolve({ bam: 'baz' });
      }
    };
    const result = await getAccedoOneService(mockAccedoOneClient).get();

    expect(result).toEqual(config.app);
  });
});
