import React from 'react';
import { storiesOf } from '@storybook/react';

import PageTitle from '../PageTitle';

storiesOf('Components|PageTitle', module).add('common', () => {
  return <PageTitle text="Text Content" />;
});
