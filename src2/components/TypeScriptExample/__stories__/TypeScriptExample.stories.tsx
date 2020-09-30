import React from 'react';

import { storiesOf } from '@storybook/react';

import TypeScriptExample from '../TypeScriptExample';

storiesOf('Base|TypeScript Example', module).add('common', () => (
  <div>
    <p>This is an example of how you can use TypeScript in Viki.</p>
    <TypeScriptExample foo="Foo value." />
  </div>
));
