import { rootReducer } from '#/redux/reducer';

describe('Redux', () => {
  describe('Reducer', () => {
    it('exports a root reducer function', () => {
      expect(typeof rootReducer).toEqual('function');
    });

    it('returns correct initial state', () => {
      const state = rootReducer({}, { type: 'TEST_ACTION' });
      expect(state.modules).toBeTruthy();
    });
  });
});
