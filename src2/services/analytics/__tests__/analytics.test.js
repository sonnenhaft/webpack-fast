const mockAccedoOne = {
  sendUsageStartEvent: jest.fn(),
  sendUsageStopEvent: jest.fn()
};

jest.mock('../../accedoOne/accedoOne', () => ({
  getAccedoOneClient: () => mockAccedoOne
}));

const { startUsage, stopUsage } = require('../analytics');

describe('analytics', () => {
  [
    ['sendUsageStartEvent', startUsage],
    ['sendUsageStopEvent', stopUsage]
  ].forEach(([fnName, moduleFn]) => {
    it(`returns the expected value on success for ${fnName}`, async () => {
      mockAccedoOne[fnName].mockImplementation(() => {
        return Promise.resolve(`${fnName}Value`);
      });

      const result = await moduleFn();

      expect(result).toEqual(`${fnName}Value`);
    });
  });

  [
    ['sendUsageStartEvent', startUsage],
    ['sendUsageStopEvent', stopUsage]
  ].forEach(([fnName, moduleFn]) => {
    it(`returns the expected value on error for ${fnName}`, async () => {
      mockAccedoOne[fnName].mockImplementation(() => {
        return Promise.reject(`${fnName}Value`);
      });

      const result = await moduleFn();

      expect(result).toEqual(`${fnName}Value`);
    });
  });
});
