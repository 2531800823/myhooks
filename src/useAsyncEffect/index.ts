import { DependencyList, useEffect } from "react";
import { isFunction } from "@/utils";

function isAsyncGenerator(
  val: AsyncGenerator<void, void, void> | any
): val is AsyncGenerator<void, void, void> {
  return isFunction(val[Symbol.asyncIterator]);
}

function useAsyncEffect(
  effect: () => AsyncGenerator<void, void, void> | Promise<void>,
  deps?: DependencyList
) {
  useEffect(() => {
    const e = effect();
    // 创建一个变量，防止 卸载后继续调用异步后操作
    let cancel = false;
    //   创建函数
    async function execute() {
      //   判断是否是一个异步迭代器函数
      if (isAsyncGenerator(e)) {
        while (true) {
          const result = await e.next();
          if (result.done || cancel) {
            break;
          }
        }
      } else {
        await e;
      }
    }

    // 运行函数
    execute();

    return () => {
      cancel = true;
    };
  }, deps);
}
export default useAsyncEffect;
