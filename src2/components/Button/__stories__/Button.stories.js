import React from 'react';
import { withInfo } from '@storybook/addon-info';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from '../Button';

storiesOf('Components|Button', module).add(
  'with text',
  withInfo()(() => <Button onClick={action('clicked')}>Button</Button>)
);
