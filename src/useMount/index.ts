import isDev from "@/utils/isDev";
import { useEffect } from "react";
import { isFunction } from "../utils/index";

/**
 * 首次渲染一次
 * @param fn 回调
 */
const useMount = (fn: () => void) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useMount: 需要的参数 fn 是一个函数，你传入的是: ${typeof fn}`
      );
    }
  }

  useEffect(() => {
    console.log("fn", isDev);
    if (!isFunction(fn)) {
      return;
    }
    fn?.();
  }, []);
};

export default useMount;
