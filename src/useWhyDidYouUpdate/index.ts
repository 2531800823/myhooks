import { useEffect, useRef } from "react";

export type IProps = Record<string, any>;

function useWhyDidYouUpdate(componentName: string, props: IProps) {
  const prevPropsRef = useRef<IProps>({});

  useEffect(() => {
    if (prevPropsRef.current) {
      const allKeys = Object.keys({ ...prevPropsRef.current, ...props });
      const changedProps: IProps = {};
      allKeys.forEach((key) => {
        if (!Object.is(prevPropsRef.current[key], props[key])) {
          changedProps[key] = {
            from: prevPropsRef.current[key],
            to: props[key],
          };
        }
      });
      if (Object.keys(changedProps).length) {
        console.log("哪些状态：", componentName, changedProps);
      }
    }

    prevPropsRef.current = props;
  });
}

export default useWhyDidYouUpdate;
