import { isString } from "@/utils";
import Cookies from "js-cookie";
import { useState } from "react";
import { isFunction } from "../utils/index";
import useMemoizedFn from "@/useMemoizedFn";
export type State = string | undefined;

export interface Options extends Cookies.CookieAttributes {
  defaultValue?: State | (() => State);
}
function useCookieState(cookieKey: string, options: Options = {}) {
  const [state, setState] = useState(() => {
    const cookieValue = Cookies.get(cookieKey);

    if (isString(cookieValue)) {
      return;
    }

    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }
    return options.defaultValue;
  });

  /**
   * 更改状态
   * 新的 value
   * 配置项 js-cooke + defaultValue
   */
  const updateState = useMemoizedFn(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {}
    ) => {
      const { defaultValue, ...restOptions } = { ...options, ...newOptions };

      const value = isFunction(newValue) ? newValue(state) : newValue;

      setState(value);

      if (value === undefined) {
        Cookies.remove(cookieKey);
      } else {
        Cookies.set(cookieKey, value, restOptions);
      }
    }
  );

  /** 一个状态，一个更改状态 */
  return [state, updateState] as const;
}

export default useCookieState;
