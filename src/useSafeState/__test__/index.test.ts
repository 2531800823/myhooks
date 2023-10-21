import { act, renderHook } from "@testing-library/react";
import useSafeState from "..";
describe("useSafeState", () => {
  const setUp = <S>(initialValue: S) =>
    renderHook(() => {
      const [state, setState] = useSafeState(initialValue);

      return { state, setState } as const;
    });

  it("测试 初始化", () => {
    const hook = setUp({
      hello: "world",
    });

    expect(hook.result.current.state).toEqual({ hello: "world" });
  });

  it("测试更改", () => {
    const hook = setUp({
      hello: "world",
    });

    expect(hook.result.current.state).toEqual({ hello: "world" });

    act(() => {
      hook.result.current.setState({ hello: "liu" });
    });
    expect(hook.result.current.state).toEqual({ hello: "liu" });
  });

  it("测试 卸载后会不会调用", () => {
    const hook = setUp({
      hello: "world",
    });

    expect(hook.result.current.state).toEqual({ hello: "world" });

    hook.unmount();

    act(() => {
      hook.result.current.setState({ hello: "liu" });
    });

    //   组件卸载 设置不上
    expect(hook.result.current.state).toEqual({ hello: "world" });
  });

  it("测试 设置的set传入的是函数", () => {
    const hook = setUp({
      hello: "world",
    });

    expect(hook.result.current.state).toEqual({ hello: "world" });

    act(() => {
      hook.result.current.setState((prev) => {
        return { ...prev, world: "hello" };
      });
    });

    //   组件卸载 设置不上
    expect(hook.result.current.state).toEqual({
      hello: "world",
      world: "hello",
    });
  });
});
