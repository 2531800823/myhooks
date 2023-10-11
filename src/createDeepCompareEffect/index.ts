import { depsEqual } from "@/utils/depsEqual";
import { DependencyList, useEffect, useLayoutEffect, useRef } from "react";

type EffectHookType = typeof useEffect | typeof useLayoutEffect;
type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

export const createDeepCompareEffect: CreateUpdateEffect = (hook) => {
  return (effect, deps) => {
    const ref = useRef<DependencyList>();
    const signalRef = useRef(0);

    if (deps === undefined || !depsEqual(deps, ref.current)) {
      ref.current = deps;
      signalRef.current += 1;
    }

    hook(effect, [signalRef.current]);
  };
};
