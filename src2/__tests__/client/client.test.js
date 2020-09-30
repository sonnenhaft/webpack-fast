/**
 * @jest-environment jsdom
 */

const client = require('#/client/client');

jest.mock('react-dom');

describe('Client', () => {
  it('renders', () => {
    expect(client).toBeTruthy();
  });
});
