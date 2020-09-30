import React from 'react';
import { storiesOf } from '@storybook/react';

import Header from '../Header';

const mockConfig = {
  accedoOne: {
    appName: 'App Name Content'
  }
};

const MockVikimapMenu = () => {
  return <div>VikimapMenu Content</div>;
};

storiesOf('Components|Header', module).add('common', () => {
  return <Header config={mockConfig} VikimapMenu={MockVikimapMenu} />;
});
