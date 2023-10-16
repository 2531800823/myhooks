import { useCallback, useState } from "react";
import { isFunction } from "../utils/index";

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)
) => void;

function useSetState<S extends Record<string, any>>(
  initialState: S | (() => S)
): [S, SetState<S>] {
  const [state, setState] = useState<S>(initialState);

  const setMergeState = useCallback((patch: any) => {
    setState((prev) => {
      const newState = isFunction(patch) ? patch(prev) : patch;
      return newState ? { ...prev, ...newState } : prev;
    });
  }, []);

  return [state, setMergeState];
}

export default useSetState;
