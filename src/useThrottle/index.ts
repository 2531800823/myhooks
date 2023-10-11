import { useState, useRef, useEffect } from "react";
import useThrottleFn from "../useThrottleFn";
import useUnmount from "@/useUnmount";

export interface ThrottleOptions {
  /** 超时时间，单位为毫秒 */
  wait?: number;
  /** 是否在延迟开始前调用函数 */
  leading?: boolean;
  /**
   * 是否在延迟开始后调用函数
   */
  trailing?: boolean;
}

/**
 * 用来处理节流值的 Hook
 * @param value
 * @param optios
 * @returns
 */
function useThrottle<T>(value: T, optios: ThrottleOptions) {
  const [stateValue, setValue] = useState(value);

  const { run } = useThrottleFn(() => {
    setValue(value);
  }, optios);

  useEffect(() => {
    run();
  }, [value]);

  return stateValue;
}

export default useThrottle;
