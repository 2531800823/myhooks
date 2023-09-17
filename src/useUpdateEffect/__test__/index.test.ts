import { renderHook } from "@testing-library/react";
import useUpdateEffect from "..";

describe("useUpdateEffect", () => {
  it("没有依赖", () => {
    let mountState = 1;
    const { rerender } = renderHook(() => {
      useUpdateEffect(() => {
        mountState = 2;
      });
    });

    expect(mountState).toBe(1);
    rerender();
    expect(mountState).toBe(2);
  });

  it("空依赖", () => {
    let mountState = 1;
    const { rerender } = renderHook(() => {
      useUpdateEffect(() => {
        mountState = 2;
      }, []);
    });

    expect(mountState).toBe(1);
    rerender();
    expect(mountState).toBe(1);
  });

  it("依赖变化", () => {
    let mountState = 1;
    const { rerender } = renderHook(() => {
      useUpdateEffect(() => {
        mountState = 3;
      }, [mountState]);
    });

    expect(mountState).toBe(1);
    rerender();
    expect(mountState).toBe(1);
    // 依赖变化
    mountState = 2;
    // 重新渲染
    rerender();
    expect(mountState).toBe(3);
  });
});
