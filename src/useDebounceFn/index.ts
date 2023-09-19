import { DebounceOptions } from "@/useDebounce";
import useLatest from "@/useLatest";
import { isFunction } from "@/utils";
import isDev from "@/utils/isDev";
import { useMemo } from "react";
import useUnmount from "@/useUnmount";
import { debounce } from "@/utils/lodash-polyfill";

type noop = (...args: any[]) => any;

function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useDebounceFn 第一个参数需要一个函数, 你传入的 ${typeof fn}`
      );
    }
  }

  const fnRef = useLatest(fn);

  const wait = options?.wait ?? 1000;

  const debounced = useMemo(() => {
    return debounce(
      (...args: Parameters<T>): ReturnType<T> => {
        return fnRef.current(...args);
      },
      wait,
      options
    );
  }, []);

  useUnmount(() => {
    debounced.cancel();
  });

  return {
    /** 延迟调用 */
    run: debounced,
    /** 关闭定时器结束 */
    cancel: debounced.cancel,
    /** 立即调用 */
    flush: debounced.flush,
  };
}

export default useDebounceFn;
