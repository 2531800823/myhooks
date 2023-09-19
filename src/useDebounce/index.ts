import useDebounceFn from "@/useDebounceFn";
import { useEffect, useState } from "react";

export interface DebounceOptions {
  /** 超时时间，单位为毫秒 */
  wait?: number;
  /** 是否在延迟开始前调用函数 */
  leading?: boolean;
  /**
   * 是否在延迟开始后调用函数
   */
  trailing?: boolean;
  /**
   * 最大等待时间，单位为毫秒
   */
  maxWait?: number;
}

/**
 * 给一个值添加防抖
 * @param value 值
 * @param options 配置项
 * @returns
 */
function useDebounce<T>(value: T, options: DebounceOptions) {
  const [stateDebounced, setDebounced] = useState(value);

  const { run } = useDebounceFn(() => {
    setDebounced(value);
  }, options);

  useEffect(() => {
    run();
  }, [value]);

  return stateDebounced;
}

export default useDebounce;
