import { useState } from "react";
import isBrowser from "@/utils/isBrowser";
import useEventListener from "@/useEventListener";

type VisibilityState = "hidden" | "visible" | "prerender" | undefined;

const getVisibility = () => {
  if (!isBrowser) {
    return "visible";
  }
  return document.visibilityState;
};

function useDocumentVisibility(): VisibilityState {
  const [stateDocumentVisibility, setDocumentVisibility] = useState(() =>
    getVisibility()
  );

  useEventListener(
    "visibilitychange",
    () => {
      setDocumentVisibility(getVisibility());
    },
    {
      target: () => document,
    }
  );

  return stateDocumentVisibility;
}
export default useDocumentVisibility;
