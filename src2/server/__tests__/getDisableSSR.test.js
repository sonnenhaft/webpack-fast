import config from '#/config';

const mockUserAgent = {
  parse: jest.fn()
};

jest.mock('useragent', () => mockUserAgent);

const getDisableSSR = require('../getDisableSSR').default;

const origDisableSSR = config.server.getDisableSSR;
beforeEach(() => {
  config.server.getDisableSSR = origDisableSSR;
  mockUserAgent.parse.mockReturnValue({
    device: {
      toJSON: () => ({})
    }
  });
});

describe('getDisableSSR', () => {
  it('returns true when config.server.disableSSR === undefined', () => {
    const mockReq = {
      headers: {
        'user-agent': 'userAgentValue'
      }
    };
    config.server.disableSSR = undefined;

    const result = getDisableSSR({ req: mockReq });

    expect(result).toEqual(true);
    expect(mockUserAgent.parse.mock.calls).toEqual([['userAgentValue']]);
  });

  it('returns false when config.server.disableSSR === undefined and the useragent is a spider', () => {
    const mockReq = {
      headers: {
        'user-agent': 'userAgentValue'
      }
    };
    config.server.disableSSR = undefined;

    mockUserAgent.parse.mockReturnValue({
      device: {
        toJSON: () => ({
          family: 'Spider'
        })
      }
    });

    const result = getDisableSSR({ req: mockReq });

    expect(result).toEqual(false);
    expect(mockUserAgent.parse.mock.calls).toEqual([['userAgentValue']]);
  });

  it('returns false when config.server.disableSSR === false', () => {
    const mockReq = {
      headers: {}
    };
    config.server.disableSSR = false;

    const result = getDisableSSR({ req: mockReq });

    expect(result).toEqual(false);
    expect(mockUserAgent.parse.mock.calls).toEqual([]);
  });
});
