import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EpgContext = React.createContext();

function EpgProvider({ children }) {
  const [programSelected, setProgramSelected] = useState({});
  const [programSelectedInfo, setProgramSelectedInfo] = useState({});

  return (
    <EpgContext.Provider
      value={{
        programSelected,
        programSelectedInfo,
        setProgramSelected,
        setProgramSelectedInfo
      }}
    >
      {children}
    </EpgContext.Provider>
  );
}

EpgProvider.propTypes = {
  children: PropTypes.node
};

export { EpgContext, EpgProvider };
