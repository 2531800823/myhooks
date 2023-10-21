import { Dispatch, SetStateAction, useCallback, useState } from "react";
import useUnmountedRef from "../useUnmountedRef/index";
import useMemoizedFn from "@/useMemoizedFn";

function useSafeState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];

function useSafeState<S = undefined>(): [
  S,
  Dispatch<SetStateAction<S | undefined>>
];

function useSafeState<S>(initialState?: S | (() => S)) {
  const unmountRef = useUnmountedRef();

  const [state, setState] = useState(initialState);

  const setCurrentState = useCallback(
    (currentState: SetStateAction<S | undefined>) => {
      if (unmountRef.current) {
        return;
      }
      setState(currentState);
    },
    []
  );

  return [state, setCurrentState];
}

export default useSafeState;
