import { useRef } from 'react';

const usePrevValue = () => {
  const prevValueRef = useRef(null);

  const updatePrevValue = value => {
    prevValueRef.current = value;
  };

  return [prevValueRef.current, updatePrevValue];
};

export { usePrevValue };
