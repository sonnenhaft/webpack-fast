import React from 'react';
import { withInfo } from '@storybook/addon-info';

import { storiesOf } from '@storybook/react';

import StorybookIntro from '../StorybookIntro';

storiesOf('Base|Introduction', module).add(
  'Please Read Me',
  withInfo()(() => <StorybookIntro />)
);
