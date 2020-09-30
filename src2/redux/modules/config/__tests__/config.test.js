import { selectors } from '..';

beforeEach(() => {
  selectors.setRootSelector(s => s);
});

describe('config.js', () => {
  describe('selectors', () => {
    describe('getAccedoOne', () => {
      it('returns the expected values', () => {
        expect(selectors.getAccedoOne({})).toBeUndefined();
        expect(selectors.getAccedoOne({ content: 'foo' })).toBeUndefined();
        expect(selectors.getAccedoOne({ content: {} })).toBeUndefined();

        expect(
          selectors.getAccedoOne({
            content: {
              accedoOne: 'accedoOneValue'
            }
          })
        ).toEqual('accedoOneValue');
      });
    });
  });
});
