import { DependencyList, EffectCallback, useEffect, useState } from "react";
import { ThrottleOptions } from "../useThrottle/index";
import useThrottleFn from "../useThrottleFn/index";
import useUpdateEffect from "@/useUpdateEffect";

function useThrottleEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  options?: ThrottleOptions
) {
  const [stateFlag, setFlag] = useState({});

  const { run } = useThrottleFn(() => {
    setFlag({});
  }, options);

  useEffect(() => {
    run();
  }, deps);

  useUpdateEffect(effect, [stateFlag]);
}

export default useThrottleEffect;
