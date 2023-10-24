import useBoolean from "@/useBoolean";
import useEventListener from "@/useEventListener";
import { BasicTarget } from "../utils/domTarget";
export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange?: (isHovering: boolean) => void;
}
function useHover(target: BasicTarget, options?: Options) {
  const { onEnter, onLeave, onChange } = options || {};
  const [state, { setTrue, setFalse }] = useBoolean(false);

  useEventListener(
    "mouseenter",
    () => {
      onEnter?.();
      setTrue();
      onChange?.(true);
    },
    { target }
  );

  useEventListener(
    "mouseleave",
    () => {
      onLeave?.();
      setTrue();
      onChange?.(true);
    },
    { target }
  );

  return state;
}
export default useHover;
