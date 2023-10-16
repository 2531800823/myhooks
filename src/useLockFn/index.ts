import { useCallback, useRef } from "react";

function useLockFn<P extends any[] = any[], V extends any = any>(
  fn: (...args: P) => Promise<V>
) {
  const lockRef = useRef(false);

  return useCallback(
    async (...args: P) => {
      if (lockRef.current) {
        return;
      }
      try {
        const res = await fn(...args);
        lockRef.current = false;
        return res;
      } catch (error) {
        lockRef.current = false;
        throw error;
      }
    },
    [fn]
  );
}

export default useLockFn;
