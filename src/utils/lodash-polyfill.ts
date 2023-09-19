import { debounce } from "lodash-es";

function isNodeOrWeb() {
  const freeGlobal =
    (typeof global === "undefined" ? "undefined" : typeof global) == "object" &&
    global &&
    global.Object === Object &&
    global;
  const freeSelf =
    typeof self == "object" && self && self.Object === Object && self;
  return freeGlobal || freeSelf;
}

if (!isNodeOrWeb()) {
  global.Date = Date;
}

/** 在 jest 模式下做一个 polyfill */
export { debounce };
