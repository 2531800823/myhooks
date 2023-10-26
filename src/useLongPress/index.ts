import isBrowser from "@/utils/isBrowser";
import { BasicTarget, getTargetElement } from "../utils/domTarget";
import useLatest from "@/useLatest";
import { useRef } from "react";
import useEffectWithTarget from "@/utils/useEffectWithTarget";

type EventType = MouseEvent | TouchEvent;

export interface Options {
  delay?: number;
  moveThreshold?: { x?: number; y?: number };
  onClick?: (event: EventType) => void;
  onLongPressEnd?: (event: EventType) => void;
}

const touchSupported =
  isBrowser &&
  // @ts-ignore
  ("ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch));

function useLongPress(
  onLongPress: (event: EventType) => void,
  target: BasicTarget,
  { delay = 300, moveThreshold, onClick, onLongPressEnd }: Options = {}
) {
  const onLongPressRef = useLatest(onLongPress);
  const onClickRef = useLatest(onClick);
  const onLongPressEndRef = useLatest(onLongPressEnd);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isTriggeredRef = useRef(false);
  const prevPositionRef = useRef({ x: 0, y: 0 });

  const hasMoveThreshold =
    !!(moveThreshold?.x && moveThreshold.x > 0) ||
    (moveThreshold?.y && moveThreshold.y > 0);

  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(target);
      if (!targetElement?.addEventListener) {
        return;
      }

      function getClientPosition(event: EventType) {
        if (event instanceof TouchEvent) {
          return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
          };
        }
        if (event instanceof MouseEvent) {
          return {
            clientX: event.clientX,
            clientY: event.clientY,
          };
        }
        console.warn("事件类型 event 不对");
        return { clientX: 0, clientY: 0 };
      }

      const overThreshold = (event: EventType) => {
        const { clientX, clientY } = getClientPosition(event);
        const offsetX = Math.abs(clientX - prevPositionRef.current.x);
        const offsetY = Math.abs(clientY - prevPositionRef.current.y);

        return (
          !!(moveThreshold?.x && offsetX > moveThreshold.x) ||
          (moveThreshold?.y && offsetY > moveThreshold.y)
        );
      };
      const onStart = (event: EventType) => {
        if (hasMoveThreshold) {
          const { clientX, clientY } = getClientPosition(event);
          prevPositionRef.current.x = clientX;
          prevPositionRef.current.y = clientY;
        }
        timerRef.current = setTimeout(() => {
          onLongPressRef.current(event);
          isTriggeredRef.current = true;
        }, delay);
      };
      const onMove = (event: TouchEvent) => {
        if (timerRef.current && overThreshold(event)) {
          clearTimeout(timerRef.current);
          timerRef.current = undefined;
        }
      };
      const onEnd = (event: EventType, shouldTriggerClick: boolean = false) => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        if (isTriggeredRef.current) {
          onLongPressRef.current(event);
        }
        if (
          shouldTriggerClick &&
          !isTriggeredRef.current &&
          onClickRef.current
        ) {
          onClickRef.current(event);
        }

        isTriggeredRef.current = false;
      };

      const onEndWithClick = (event: EventType) => {
        return onEnd(event, true);
      };

      if (!touchSupported) {
        targetElement.addEventListener("mousedown", onStart);
        targetElement.addEventListener("mouseup", onEndWithClick);
        targetElement.addEventListener("mouseleave", onEnd);
        if (hasMoveThreshold) {
          targetElement.addEventListener("mousemove", onMove);
        }
      } else {
        targetElement.addEventListener("touchStart", onStart);
        targetElement.addEventListener("touchEnd", onEndWithClick);
        if (hasMoveThreshold) {
          targetElement.addEventListener("touchmove", onMove);
        }
      }

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          isTriggeredRef.current = false;
        }
        if (!touchSupported) {
          targetElement.removeEventListener("mousedown", onStart);
          targetElement.removeEventListener("mouseup", onEndWithClick);
          targetElement.removeEventListener("mouseleave", onEnd);
          if (hasMoveThreshold) {
            targetElement.removeEventListener("mousemove", onMove);
          }
        } else {
          targetElement.removeEventListener("touchStart", onStart);
          targetElement.removeEventListener("touchEnd", onEndWithClick);
          if (hasMoveThreshold) {
            targetElement.removeEventListener("touchmove", onMove);
          }
        }
      };
    },
    [],
    target
  );
}

export default useLongPress;
