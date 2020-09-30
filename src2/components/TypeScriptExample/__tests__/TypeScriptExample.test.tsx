/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, waitForElement } from 'react-testing-library';

import TypeScriptExample from '../TypeScriptExample';

describe('TypeScriptExample', () => {
  it('renders the content', async () => {
    const { getByText } = render(<TypeScriptExample foo="test value" />);
    const getCheckForRegexp = (regexp: RegExp) => {
      return () => {
        return getByText(text => regexp.test(text));
      };
    };

    await waitForElement(getCheckForRegexp(/TEST VALUE/));

    expect(getCheckForRegexp(/TEST VALUE/)).not.toThrow();
    expect(getCheckForRegexp(/test value/)).toThrow();
  });
});
