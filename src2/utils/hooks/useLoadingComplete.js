import { useEffect, useRef } from 'react';

import { noop } from '#/helpers';

const useLoadingComplete = ({ loading, onComplete = noop }) => {
  const loadingRef = useRef(null);

  useEffect(() => {
    if (loadingRef.current && !loading) {
      onComplete?.();
    }
    loadingRef.current = loading;
  }, [loading]);
};

export { useLoadingComplete };
