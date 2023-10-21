import isBrowser from "@/utils/isBrowser";
import { createUseStorageState } from "../createUseStorageState/index";

const useLocalStorageState = createUseStorageState(() => {
  return isBrowser ? localStorage : undefined;
});

export default useLocalStorageState;
