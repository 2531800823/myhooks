import useLatest from "@/useLatest";
import { useCallback, useEffect, useRef } from "react";
import { isNumber } from "../utils/index";

interface Handle {
  id: number | NodeJS.Timeout;
}

const setRafInterval = function (fn: () => void, delay: number = 0): Handle {
  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setInterval(fn, delay),
    };
  }

  let start = new Date().getTime();

  const handle: Handle = {
    id: 0,
  };

  const loop = () => {
    const current = new Date().getTime();
    if (current - start >= delay) {
      fn();
      start - new Date().getTime();
    }
    handle.id = requestAnimationFrame(loop);
  };
  handle.id = requestAnimationFrame(loop);
  return handle;
};

/**
 * 判断 环境是否支持 cancelAnimationFrame
 * @param t  占位 定义返回类型
 * @returns
 */
function cancelAnimationFrameIsNotDefined(t: any): t is NodeJS.Timeout {
  return typeof cancelAnimationFrame === typeof undefined;
}

function clearRafInterval(handle: Handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearInterval(handle.id);
  }

  cancelAnimationFrame(handle.id);
}

function useRafInterval(
  fn: () => void,
  delay?: number,
  options?: { immediate: boolean }
) {
  const immediate = options?.immediate;

  const fnRef = useLatest(fn);
  const timerRef = useRef<Handle>();

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) {
      return;
    }
    if (immediate) {
      fnRef.current();
    }
    timerRef.current = setRafInterval(() => {
      fnRef.current;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearRafInterval(timerRef.current);
      }
    };
  }, [delay]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearRafInterval(timerRef.current);
    }
  }, []);

  return clear;
}

export default useRafInterval;
