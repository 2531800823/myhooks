import { BasicTarget, getTargetElement } from "../utils/domTarget";
import useLatest from "@/useLatest";
import useDeepCompareEffectWithTarget from "@/utils/useDeepCompareEffectWithTarget";

function useMutationObserver(
  callback: MutationCallback,
  target: BasicTarget,
  options: MutationObserverInit = {}
) {
  const callbackRef = useLatest(callback);

  useDeepCompareEffectWithTarget(
    () => {
      const element = getTargetElement(target);
      if (!element) {
        return;
      }
      const observer = new MutationObserver(callbackRef.current);

      observer.observe(element, options);
      return () => {
        observer?.disconnect();
      };
    },
    [options],
    target
  );
}
export default useMutationObserver;
