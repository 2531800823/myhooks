import { useMemo } from "react";
import useToggle from "../useToggle/index";
export interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  set: (val: boolean) => void;
  toggle: () => void;
}
function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle, set }] = useToggle(!!defaultValue);

  const actions = useMemo(() => {
    const setTrue = () => set(true);
    const setFalse = () => set(false);
    return {
      toggle,
      setTrue,
      setFalse,
      set: (v: boolean) => set(!!v),
    };
  }, []);

  return [state, actions];
}

export default useBoolean;
