import useLatest from "@/useLatest";
import { useCallback, useEffect, useRef } from "react";
import { isNumber } from "../utils/index";
type Handle = {
  id: number | NodeJS.Timeout;
};

function setRafTimeout(fn: () => void, delay: number = 0): Handle {
  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setTimeout(fn, delay),
    };
  }

  const handle: Handle = {
    id: 0,
  };

  const startTime = new Date().getTime();
  const loop = () => {
    const current = new Date().getTime();
    if (current - startTime >= delay) {
      fn();
    } else {
      handle.id = requestAnimationFrame(loop);
    }
  };

  handle.id = requestAnimationFrame(loop);
  return handle;
}

function cancelAnimationFrameIsNotDefined(t: any): t is NodeJS.Timeout {
  return typeof cancelAnimationFrame === typeof undefined;
}

function clearRafTimeout(handle: Handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearTimeout(handle.id);
  }
  cancelAnimationFrame(handle.id);
}

function useRafTimeout(fn: () => void, delay?: number) {
  const fnRef = useLatest(fn);

  const timerRef = useRef<Handle>();

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) {
      return;
    }
    timerRef.current = setRafTimeout(() => {
      fnRef.current();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearRafTimeout(timerRef.current);
      }
    };
  }, [delay]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearRafTimeout(timerRef.current);
    }
  }, []);

  return clear;
}
export default useRafTimeout;
