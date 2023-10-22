import { BasicTarget } from "@/utils/domTarget";
import useLatest from "@/useLatest";
import useEffectWithTarget from "@/utils/useEffectWithTarget";
import { getTargetElement } from "../utils/domTarget";
import getDocumentOrShadow from "../utils/getDocumentOrShadow";

type DocumentEventKey = keyof DocumentEventMap;

function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = "click"
) {
  const onClickAwayRef = useLatest(onClickAway);

  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target];

        const isNotCurrent = targets.some((item) => {
          const targetElement = getTargetElement(item);
          return !targetElement || targetElement.contains(event.target);
        });
        if (isNotCurrent) {
          return;
        }
        onClickAwayRef.current(event);
      };

      const documentOrShadow = getDocumentOrShadow(target);

      const eventNames = Array.isArray(eventName) ? eventName : [eventName];

      eventNames.forEach((event) =>
        documentOrShadow.addEventListener(event, handler)
      );

      return () => {
        eventNames.forEach((event) =>
          documentOrShadow.removeEventListener(event, handler)
        );
      };
    },
    Array.isArray(eventName) ? eventName : [eventName],
    target
  );
}

export default useClickAway;
