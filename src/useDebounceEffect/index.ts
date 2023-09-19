import { DebounceOptions } from "@/useDebounce";
import { DependencyList, EffectCallback, useEffect, useState } from "react";
import useDebounceFn from "@/useDebounceFn";
import useUpdateEffect from "@/useUpdateEffect";

/**
 * 防抖的 useEffect
 * @param effect
 * @param deps
 * @param options
 */
function useDebounceEffect(
  effect: EffectCallback,
  deps: DependencyList,
  options?: DebounceOptions
) {
  const [stateFlag, setFlag] = useState({});

  // 创建一个 防抖函数，
  const { run } = useDebounceFn(() => {
    setFlag({});
  }, options);

  // 首次会更新哦
  useEffect(() => {
    //   依赖变更调用防抖函数
    return run();
  }, deps);

  //   防抖函数触发 更新 useEffect
  useUpdateEffect(effect, [stateFlag]);
}

export default useDebounceEffect;
