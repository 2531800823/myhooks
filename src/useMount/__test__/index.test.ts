import { act, renderHook } from "@testing-library/react";
import useMount from "..";

describe("测试 useMount", () => {
  it("测试渲染", () => {
    const fn = jest.fn();

    // 渲染 hooks
    const { rerender, unmount } = renderHook(() => useMount(fn));
    // 函数只调用一次
    expect(fn).toHaveBeenCalledTimes(1);

    // 更改 state 重新出发 render
    rerender();

    // 函数只调用一次
    expect(fn).toHaveBeenCalledTimes(1);

    unmount();
    expect(fn).toHaveBeenCalledTimes(1);

    renderHook(() => useMount(fn));

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it.skip("错误情况", () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {
      console.log("123");
    });

    renderHook(() => useMount(1 as any));
    expect(errSpy).toHaveBeenCalledWith(
      "useMount: 需要的参数 fn 是一个函数，你传入的是: number"
    );

    errSpy.mockRestore();
  });
});
