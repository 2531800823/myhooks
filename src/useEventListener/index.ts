import useLatest from "@/useLatest";
import { BasicTarget } from "@/utils/domTarget";
import useEffectWithTarget from "@/utils/useEffectWithTarget";
import { getTargetElement } from "../utils/domTarget";

type noop = (...p: any) => void;

export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options<T extends Target = Target> = {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
};

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handle: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>
): void;
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handle: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>
): void;
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handle: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handle: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>
): void;

function useEventListener(
  eventName: string,
  handler: noop,
  options: Options
): void;

function useEventListener(
  eventName: string,
  handle: noop,
  options: Options = {}
) {
  const handleRef = useLatest(handle);

  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(options.target, window);
      if (!targetElement?.addEventListener) {
        return;
      }

      const eventListener = (event: Event) => {
        return handleRef.current(event);
      };

      targetElement.addEventListener(eventName, eventListener, {
        capture: options.capture,
        once: options.once,
        passive: options.passive,
      });

      return () => {
        targetElement.removeEventListener(eventName, eventListener, {
          capture: options.capture,
        });
      };
    },
    [eventName, options.capture, options.once, options.passive],
    options.target
  );
}

export default useEventListener;
