import { useCallback, useState } from "react";
import useLatest from "@/useLatest";
import { isFunction } from "../utils/index";

interface EventTarget<U> {
  target: {
    value: U;
  };
}

export interface Options<T, U> {
  initialValue?: T;
  transformer?: (value: U) => T;
}

function useEventTarget<T, U = T>(options?: Options<T, U>) {
  const { initialValue, transformer } = options || {};
  const [state, setState] = useState(initialValue);

  const transformerRef = useLatest(transformer);

  const onchange = (e: EventTarget<U>) => {
    const _value = e.target.value;
    if (isFunction(transformerRef.current)) {
      return setState(transformerRef.current(_value));
    }
    return setState(_value as unknown as T);
  };

  const reset = useCallback(() => {
    setState(initialValue);
  }, []);

  return [state, { onchange, reset }] as const;
}
export default useEventTarget;
