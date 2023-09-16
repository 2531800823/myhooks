import useLatest from "@/useLatest";
import { useEffect } from "react";
import { isFunction } from "../utils/index";
import isDev from "@/utils/isDev";

/**
 * 在组件卸载（unmount）时执行的 Hook。
 * @param fn
 */
function useUnmount(fn: () => void) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useUnmount: 需要的参数 fn 是一个函数，你传入的是: ${typeof fn}`
      );
    }
  }
  const fnRef = useLatest(fn);
  useEffect(
    () => () => {
      if (!isFunction(fnRef.current)) {
        return;
      }
      fnRef.current?.();
    },
    []
  );
}

export default useUnmount;
