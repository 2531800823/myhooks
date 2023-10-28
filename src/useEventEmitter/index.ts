import { useRef, useEffect } from "react";
import useLatest from "@/useLatest";

type SubScription<T> = (val: T) => void;

export class EventEmitter<T> {
  private subscriptions = new Set<SubScription<T>>();

  emit = (val: T) => {
    for (const subscription of this.subscriptions) {
      subscription(val);
    }
  };

  useSubscription = (callback: SubScription<T>) => {
    const callbackRef = useLatest<SubScription<T>>(callback);
    useEffect(() => {
      function subScription(val: T) {
        if (callbackRef.current) {
          callbackRef.current(val);
        }
      }

      this.subscriptions.add(subScription);
      return () => {
        this.subscriptions.delete(subScription);
      };
    }, []);
  };
}

function useEventEmitter<T = void>() {
  const ref = useRef<EventEmitter<T>>();
  if (!ref.current) {
    ref.current = new EventEmitter();
  }
  return ref.current;
}

export default useEventEmitter;
