import { useLayoutEffect } from "react";
import createEffectWithTarget from "./createEffectWithTarget";

export default function useLayoutEffectWithTarget() {
  return createEffectWithTarget(useLayoutEffect);
}
