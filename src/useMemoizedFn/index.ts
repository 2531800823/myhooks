import isDev from "@/utils/isDev";
import { useMemo, useRef } from "react";
import { isFunction } from "../utils/index";

type noop = (this: any, ...arg: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...ages: Parameters<T>
) => ReturnType<T>;

function useMemoizedFn<T extends noop>(fn: T) {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useMemoizedFn 需要一个函数，你传入的是 ${typeof fn}`);
    }
  }

  const fnRef = useRef<T>(fn);

  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef<PickFunction<T>>();

  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
}

export default useMemoizedFn;
