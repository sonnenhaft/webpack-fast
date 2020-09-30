import { useState } from 'react';

export const usePureState = (initialState = {}) => {
  const [state, setState] = useState(initialState);

  const mergeState = (newState = {}) => setState({ ...state, ...newState });

  return { state, setState: mergeState };
};
