import React from 'react';

import appConfig from '#/config';

const withConfig = Component => {
  const ConfigWrapper = props => {
    return (
      <div>
        <Component config={appConfig.app} {...props} />
      </div>
    );
  };

  return ConfigWrapper;
};

export default withConfig;
