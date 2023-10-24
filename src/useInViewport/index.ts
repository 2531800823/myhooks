import { useState } from "react";
import { BasicTarget, getTargetElement } from "../utils/domTarget";
import useEffectWithTarget from "@/utils/useEffectWithTarget";

type CallbackType = (entry: IntersectionObserverEntry) => void;

export interface Options {
  rootMargin?: string;
  threshold?: number | number[];
  root?: BasicTarget<Element>;
  callback?: CallbackType;
}

function useInViewport(target: BasicTarget | BasicTarget[], options?: Options) {
  const { callback, ...option } = options || {};

  const [state, setState] = useState<boolean>();
  const [stateRatio, setRatio] = useState<number>();

  useEffectWithTarget(
    () => {
      const targets = Array.isArray(target) ? target : [target];
      const els = targets
        .map((element) => getTargetElement(element))
        .filter(Boolean);

      if (!els.length) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setRatio(entry.intersectionRatio);
            setState(entry.isIntersecting);
            callback?.(entry);
          }
        },
        { ...option, root: getTargetElement(option.root) }
      );

      els.forEach((el) => {
        if (el) {
          observer.observe(el);
        }
      });

      return () => {
        observer.disconnect();
      };
    },
    [option.rootMargin, option.threshold, callback],
    target
  );

  return [state, setRatio] as const;
}

export default useInViewport;
