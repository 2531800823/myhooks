import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

type ResetState = () => void;

function useResetState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, ResetState];

function useResetState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
  ResetState
];

function useResetState<S>(initialState?: S) {
  const [state, setState] = useState(initialState);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return [state, setState, resetState] as const;
}

export default useResetState;
