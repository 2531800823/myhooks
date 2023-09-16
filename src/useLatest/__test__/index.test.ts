import { renderHook } from "@testing-library/react";
import useLatest from "..";

/**
 * 封装一个 renderHooks
 * @param val 传入 默认值
 * @returns
 */
const setUp = (val: any) =>
  //第一个参数 fn 会接受一个参数 state 就是 函数组件的 state
  renderHook((state) => useLatest(state), {
    initialProps: val,
  });

describe("useLatest", () => {
  it("测试简单类型", () => {
    const { rerender, result } = setUp(0);

    expect(result.current.current).toBe(0);

    //   重新调用 renderHook 的第一个函数，把参数带上
    rerender(1);
    expect(result.current.current).toBe(1);

    rerender(2);
    expect(result.current.current).toBe(2);

    rerender(3);
    expect(result.current.current).toBe(3);
  });

  it("复杂类型", () => {
    const { rerender, result } = setUp({});

    expect(result.current.current).toEqual({});

    const fn = jest.fn();
    rerender(fn);
    expect(result.current.current).toBe(fn);

    rerender([]);
    expect(result.current.current).toEqual([]);
  });
});
