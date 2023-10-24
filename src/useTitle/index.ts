import { useEffect, useRef } from "react";
import isBrowser from "@/utils/isBrowser";
import useMount from "@/useMount";

export interface Options {
  restoreOnUnmount?: boolean;
}

const DEFAULT_OPTIONS: Options = {
  restoreOnUnmount: false,
};

function useTitle(title: string, options: Options = DEFAULT_OPTIONS) {
  const titleRef = useRef(isBrowser ? document.title : "");
  useEffect(() => {
    document.title = title;
  }, [title]);
  useMount(() => {
    if (options.restoreOnUnmount) {
      document.title = titleRef.current;
    }
  });
}
export default useTitle;
