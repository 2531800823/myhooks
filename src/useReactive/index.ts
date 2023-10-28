import { useRef } from "react";
import useUpdate from "../useUpdate/index";
import useCreation from "../useCreation/index";
import { isPlainObject } from "lodash-es";

// k:v 源对象：代理对象
const proxyMap = new WeakMap();

// k:v 代理对象：源对象
const rawMap = new WeakMap();

function observer<T extends Record<string, any>>(
  initialValue: T,
  cb: () => void
): T {
  const existingProxy = proxyMap.get(initialValue);

  // 添加缓存防止重新构建 proxy
  if (existingProxy) {
    return existingProxy;
  }

  // 防止代理过的对象
  if (rawMap.has(initialValue)) {
    return initialValue;
  }

  const proxy = new Proxy<T>(initialValue, {
    get: (target, key, receiver) => {
      const res = Reflect.get(target, key, receiver);
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
      if (!descriptor?.configurable && !descriptor?.writable) {
        return res;
      }
      //   检查是否是普通对象，普通返回
      return isPlainObject(res) || Array.isArray(res) ? observer(res, cb) : res;
    },
    set: (target, key, val) => {
      const res = Reflect.set(target, key, val);
      cb();
      return res;
    },
    deleteProperty: (target, key) => {
      const ret = Reflect.deleteProperty(target, key);
      cb();
      return ret;
    },
  });

  proxyMap.set(initialValue, proxy);
  rawMap.set(proxy, initialValue);

  return proxy;
}

function useReactive<S extends Record<string, any>>(initialState: S): S {
  const update = useUpdate();
  const stateRef = useRef<S>(initialState);

  const state = useCreation(() => {
    return observer(stateRef.current, () => {
      update();
    });
  }, []);

  return state;
}

export default useReactive;
