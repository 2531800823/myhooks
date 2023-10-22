import createEffectWithTarget from "./createEffectWithTarget";
import { useEffect } from "react";

const useEffectWithTarget = createEffectWithTarget(useEffect);

export default useEffectWithTarget;
