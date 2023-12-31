import useMemoizedFn from "@/useMemoizedFn";
import { useCallback, useEffect, useRef } from "react";
import { isNumber } from "../utils/index";
function useTimeout(fn: () => void, delay?: number) {
  const timerCallback = useMemoizedFn(fn);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) {
      return;
    }

    timerRef.current = setTimeout(timerCallback, delay);

    return clear;
  }, [delay]);

  return clear;
}

export default useTimeout;
