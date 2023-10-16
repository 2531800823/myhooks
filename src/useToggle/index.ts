import { useMemo, useState } from "react";

export interface Actions<T> {
  setLeft: () => void;
  setRight: () => void;
  set: (value: T) => void;
  toggle: () => void;
}

function useToggle<T = boolean>(): [boolean, Actions<T>];

function useToggle<T>(defaultValue: T): [boolean, Actions<T>];

function useToggle<T, U>(
  defaultValue: T,
  reverseValue: T
): [T | U, Actions<T | U>];

function useToggle<D, R>(defaultValue: D = false as D, reverseValue?: R) {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo(() => {
    const reverseValueOrigin = (
      reverseValue === undefined ? !defaultValue : reverseValue
    ) as R | D;

    const toggle = () =>
      setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));

    const set = (value: R | D) => setState(value);

    const setLeft = () => setState(defaultValue);
    const setRight = () => setState(reverseValueOrigin);

    return {
      toggle,
      set,
      setLeft,
      setRight,
    };
  }, []);

  return [state, actions];
}

export default useToggle;
