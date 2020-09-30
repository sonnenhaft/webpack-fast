import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PlayerContext = React.createContext();

function PlayerProvider({ children }) {
  const [playerInstanceFromContext, setPlayerInstanceToContext] = useState(
    null
  );

  return (
    <PlayerContext.Provider
      value={{ playerInstanceFromContext, setPlayerInstanceToContext }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

PlayerProvider.propTypes = {
  children: PropTypes.node
};

export { PlayerContext, PlayerProvider };
