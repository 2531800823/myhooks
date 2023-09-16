import { renderHook } from "@testing-library/react";
import useUnmount from "..";

describe("useUnmount", () => {
  it("测试 卸载组件", () => {
    const fn = jest.fn();
    const { rerender, unmount } = renderHook(() => useUnmount(fn));
    expect(fn).toBeCalledTimes(0);
    //   重新渲染
    rerender();
    expect(fn).toBeCalledTimes(0);
    // 卸载
    unmount();
    expect(fn).toBeCalledTimes(1);
  });

  it("测试 错误 卸载组件", () => {
    //   监听函数，重写
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { rerender, unmount } = renderHook(() => useUnmount(1 as any));
    rerender();
    //   卸载
    unmount();

    //   调用函数参数
    expect(spy).toBeCalledWith(
      "useUnmount: 需要的参数 fn 是一个函数，你传入的是: number"
    );

    //   恢复为之前函数
    spy.mockRestore();
  });
});
