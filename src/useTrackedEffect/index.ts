import { DependencyList, useEffect, useRef } from "react";

type Effect<T extends DependencyList> = (
  changes?: number[],
  previousDeps?: T,
  currentDeps?: T
) => void | (() => void);

function diffTwoDeps(deps1?: DependencyList, deps2?: DependencyList) {
  return deps1
    ? deps1
        .map((_ele, idx) => (!Object.is(deps1[idx], deps2?.[idx]) ? idx : -1))
        .filter((ele) => ele >= 0)
    : deps2
    ? deps2.map((ele, idx) => idx)
    : [];
}

function useTrackedEffect<T extends DependencyList>(
  effect: Effect<T>,
  deps?: [...T]
) {
  const previousDepsRef = useRef<T>();

  useEffect(() => {
    const changes = diffTwoDeps(previousDepsRef.current, deps);
    const previousDeps = previousDepsRef.current;
    previousDepsRef.current = deps;
    return effect(changes, previousDeps, deps);
  }, deps);
}

export default useTrackedEffect;
