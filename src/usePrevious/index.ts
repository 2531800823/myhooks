import { useRef } from "react";

export type ShouldUpdateFun<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b);
function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFun<T> = defaultShouldUpdate
): T | undefined {
  const prevRef = useRef<T>();
  const curRef = useRef<T>();

  if (shouldUpdate(curRef.current, state)) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
}

export default usePrevious;
