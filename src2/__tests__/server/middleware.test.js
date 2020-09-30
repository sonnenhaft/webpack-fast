/**
 * @jest-environment jsdom
 */

import renderApp from '#/server/middleware/renderApp';
import renderError from '#/server/middleware/renderError';

describe('Server', () => {
  describe('Middleware', () => {
    describe('renderApp', () => {
      it('returns a function', () => {
        expect(typeof renderApp).toEqual('function');
      });
    });
    describe('renderError', () => {
      it('returns a function', () => {
        expect(typeof renderError).toEqual('function');
      });
    });
  });
});
