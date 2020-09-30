import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import AssetItem from '../AssetItem';

const templatesMock = {
  AccedoOneItemAction: {},
  AccedoOneItemActionToRoute: {},
  OVPItemType: {},
  OVPItemTypeRoutes: {}
};

storiesOf('Components|AssetItem', module).add(
  'with title and subtitle',
  withInfo({})(() => (
    <AssetItem
      templates={templatesMock}
      item={{
        title: 'item title',
        subTitle: 'item subtitle'
      }}
    />
  ))
);
