import { renderHook, act } from "@testing-library/react";
import useResetState from "..";

describe("useResetState", () => {
  const setUp = <S>(initialValue: S) => {
    return renderHook(() => {
      const [state, setState, resetState] = useResetState(initialValue);

      return { state, setState, resetState } as const;
    });
  };

  it("测试 初始值", () => {
    const hook = setUp({
      hello: "world",
    });

    expect(hook.result.current.state).toEqual({
      hello: "world",
    });
  });

  it("测试 重置状态", () => {
    const hook = setUp({
      hello: "world",
      count: 0,
    });

    expect(hook.result.current.state).toEqual({
      hello: "world",
      count: 0,
    });

    act(() => {
      hook.result.current.setState((prev) => {
        return { ...prev, count: 1 };
      });
    });

    expect(hook.result.current.state).toEqual({
      hello: "world",
      count: 1,
    });

    act(() => {
      hook.result.current.resetState();
    });

    expect(hook.result.current.state).toEqual({
      hello: "world",
      count: 0,
    });
  });
});
