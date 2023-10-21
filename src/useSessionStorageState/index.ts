import { createUseStorageState } from "../createUseStorageState/index";
import isBrowser from "@/utils/isBrowser";

const useSessionStorageState = createUseStorageState(() =>
  isBrowser ? sessionStorage : undefined
);

export default useSessionStorageState;
