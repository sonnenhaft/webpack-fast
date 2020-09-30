import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PageContext = React.createContext();

function PageProvider({ children }) {
  const [routeToDisplayTextMap, setRouteToDisplayTextMap] = useState({});
  const [pageTitle, setPageTitle] = useState('');

  return (
    <PageContext.Provider
      value={{
        pageTitle,
        routeToDisplayTextMap,
        setPageTitle,
        setRouteToDisplayTextMap
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

PageProvider.propTypes = {
  children: PropTypes.node
};

export { PageContext, PageProvider };
