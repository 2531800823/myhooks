import isBrowser from "@/utils/isBrowser";
import useLayoutEffectWithTarget from "./useLayoutEffectWithTarget";
import useEffectWithTarget from "@/utils/useEffectWithTarget";
const useIsomorphicLayoutEffectWithTarget = isBrowser
  ? useLayoutEffectWithTarget
  : useEffectWithTarget;
export default useIsomorphicLayoutEffectWithTarget;
