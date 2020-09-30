import React, { useState } from 'react';
import PropTypes from 'prop-types';

const HistoryContext = React.createContext();

function HistoryProvider({ children }) {
  const [pathname, setPathname] = useState('');

  return (
    <HistoryContext.Provider
      value={{
        pathname,
        setPathname
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

HistoryProvider.propTypes = {
  children: PropTypes.node
};

export { HistoryContext, HistoryProvider };
