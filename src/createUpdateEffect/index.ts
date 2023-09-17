import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * useEffect 类型和 useLayoutEffect
 */
type EffectHookType = typeof useEffect | typeof useLayoutEffect;

/**
 * 创建一个 layoutEffect 和 Effect 通用的 hook 方式, 高阶组件
 * @param hook 传入 useEffect | useLayoutEffect
 * @returns (函数 , 依赖) => void
 */
export const createUpdateEffect: (hook: EffectHookType) => EffectHookType =
  (hook) => (effect, deps) => {
    const isMount = useRef(false);

    //    用于 react-refresh
    hook(() => {
      return () => {
        isMount.current = false;
      };
    }, []);

    hook(() => {
      if (isMount.current) {
        return effect();
      } else {
        isMount.current = true;
      }
    }, deps);
  };

export default createUpdateEffect;
