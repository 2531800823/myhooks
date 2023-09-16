import { useEffect, useRef } from "react";

/**
 * 获取当前组件是否已经卸载的 Hook。
 */
function useUnmountedRef() {
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  return unmountedRef;
}

export default useUnmountedRef;
