import React, { useState } from 'react';
import { compose, withProps } from 'recompose';

import withConfig from '#/containers/utils/withConfig';
import HeaderComponent from '#/components/Header/Header';
import VikimapMenu from '#/containers/Menu/VikimapMenu';

const HeaderContainer = props => {
  const [isCollapsed, setCollapsedState] = useState(true);
  const onMenuCollapse = () => setCollapsedState(true);
  const onMenuToggle = () => setCollapsedState(!isCollapsed);

  return (
    <HeaderComponent
      isCollapsed={isCollapsed}
      onMenuCollapse={onMenuCollapse}
      onMenuToggle={onMenuToggle}
      {...props}
    />
  );
};

const enhance = compose(
  withProps({ VikimapMenu }),
  withConfig
);

export default enhance(HeaderContainer);
