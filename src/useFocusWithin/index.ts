import { useState } from "react";
import { BasicTarget } from "../utils/domTarget";
import useEventListener from "@/useEventListener";
export interface Options {
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onChange?: (isFocusWithin: boolean) => void;
}

function useFocusWithin(target: BasicTarget, options?: Options) {
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const { onBlur, onChange, onFocus } = options || {};

  useEventListener(
    "focusin",
    (e: FocusEvent) => {
      if (!isFocusWithin) {
        onFocus?.(e);
        onChange?.(true);
        setIsFocusWithin(true);
      }
    },
    {
      target,
    }
  );

  useEventListener(
    "focusout",
    (e: FocusEvent) => {
      if (
        isFocusWithin &&
        !(e.currentTarget as Element)?.contains?.(e.relatedTarget as Element)
      ) {
        onBlur?.(e);
        onChange?.(false);
        setIsFocusWithin(false);
      }
    },
    {
      target,
    }
  );

  return isFocusWithin;
}

export default useFocusWithin;
