import { forEach, mapKeys } from "lodash-es";
import { useEffect, useRef, useState } from "react";

type JsOptions = {
  type: "js";
  js?: Partial<HTMLScriptElement>;
  keepWhenUnused?: boolean;
};

type CssOptions = {
  type: "css";
  css?: Partial<HTMLStyleElement>;
  keepWhenUnused?: boolean;
};

type DefaultOptions = {
  type?: never;
  js?: Partial<HTMLScriptElement>;
  css?: Partial<HTMLStyleElement>;
  keepWhenUnused?: boolean;
};

const EXTERNAL_USED_COUNT: Record<string, number> = {};

export type Options = JsOptions | CssOptions | DefaultOptions;

export type Status = "unset" | "loading" | "ready" | "error";

interface LoadResult {
  ref: Element;
  status: Status;
}

const loadScript = (path: string, props = {}): LoadResult => {
  const script = document.querySelector(`script[src='${path}']`);

  if (!script) {
    const newScript = document.createElement("script");
    newScript.src = path;

    mapKeys(props, (key) => {
      newScript[key] = props[key];
    });

    newScript.setAttribute("data-status", "loading");
    document.body.appendChild(newScript);

    return {
      ref: newScript,
      status: "loading",
    };
  }

  return {
    ref: script,
    status: (script.getAttribute("data-status") as Status) || "ready",
  };
};

const loadCss = (path: string, props = {}): LoadResult => {
  const css = document.querySelector(`link[href='${path}']`);

  if (!css) {
    const newCss = document.createElement("link");
    newCss.href = path;
    newCss.rel = "stylesheet";

    mapKeys(props, (key) => {
      newCss[key] = props[key];
    });

    //   ID9+
    const isLegacyIEcss = "hideFocus" in newCss;

    if (isLegacyIEcss && newCss.relList) {
      newCss.rel = "preload";
      newCss.as = "style";
    }

    newCss.setAttribute("data-status", "loading");
    document.body.appendChild(newCss);

    return {
      ref: newCss,
      status: "loading",
    };
  }

  return {
    ref: css,
    status: (css.getAttribute("data-status") as Status) || "ready",
  };
};

function useExternal(path?: string, options?: Options) {
  const [stateStatus, setStatus] = useState(path ? "loading" : "unset");

  const ref = useRef<Element>();

  useEffect(() => {
    if (!path) {
      setStatus("unset");
      return;
    }

    const pathname = path.replace(/[|#].*$/, "");
    if (
      options?.type === "css" ||
      (!options?.type && /(^css!|\.css$)/.test(pathname))
    ) {
      const result = loadCss(path, options?.css);
      ref.current = result.ref;
      setStatus(result.status);
    } else if (
      options?.type === "js" ||
      (!options?.type && /(^js!|.js$)/.test(pathname))
    ) {
      const result = loadScript(path, options?.js);
      ref.current = result.ref;
      setStatus(result.status);
    } else {
      console.error("只支持 js 和 css 的资源插入");
    }

    if (!ref.current) {
      return;
    }

    if (EXTERNAL_USED_COUNT[path] === undefined) {
      EXTERNAL_USED_COUNT[path] = 1;
    } else {
      EXTERNAL_USED_COUNT[path] += 1;
    }

    const handler = (e: Event) => {
      const targetStatus = e.type === "load" ? "ready" : "error";
      ref.current?.setAttribute("data-status", targetStatus);
      setStatus(targetStatus);
    };

    ref.current.addEventListener("load", handler);
    ref.current.addEventListener("error", handler);

    return () => {
      ref.current?.removeEventListener("load", handler);
      ref.current?.removeEventListener("error", handler);

      EXTERNAL_USED_COUNT[path] -= 1;
      if (EXTERNAL_USED_COUNT[path] === 0 && !options?.keepWhenUnused) {
        ref.current?.remove();
      }

      ref.current = undefined;
    };
  }, [path]);

  return stateStatus;
}

export default useExternal;
