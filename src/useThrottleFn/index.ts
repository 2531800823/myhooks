import { ThrottleOptions } from "@/useThrottle";
import isDev from "@/utils/isDev";
import { isFunction } from "../utils/index";
import useLatest from "@/useLatest";
import { useEffect, useMemo } from "react";
import { throttle } from "lodash-es";
import useUnmount from "@/useUnmount";

type noop = (...args: any[]) => any;
function useThrottleFn<T extends noop>(fn: T, options?: ThrottleOptions) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useThrottle 第一个参数需要一个函数, 你传入的 ${typeof fn}`
      );
    }
  }

  const fnRef = useLatest(fn);

  const wait = options?.wait ?? 1000;
  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
        },
        wait,
        options
      ),
    []
  );

  useUnmount(() => {
    throttled.cancel();
  });

  return {
    run: throttled,
    cancel: throttled.cancel,
    flush: throttled.flush,
  };
}

export default useThrottleFn;
