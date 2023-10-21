import useMount from "@/useMount";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

function useRafState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];

function useRafState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
];

function useRafState<S>(initialState?: S | (() => S)) {
  const ref = useRef(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback(
    (value: S | ((prevState: S | undefined) => S)) => {
      cancelAnimationFrame(ref.current);

      ref.current = requestAnimationFrame(() => {
        setState(value);
      });
    },
    []
  );

  useMount(() => {
    cancelAnimationFrame(ref.current);
  });

  return [state, setRafState];
}

export default useRafState;
