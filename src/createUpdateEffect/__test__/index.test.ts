import { renderHook } from "@testing-library/react";
import { useEffect, useLayoutEffect } from "react";
import createUpdateEffect from "..";

describe("创建 useUpdateEffect", () => {
  const useUpdateEffect = createUpdateEffect(useEffect);

  it("渲染 useUpdateEffect, 依赖项变了才会渲染", () => {
    let mountState = 1;
    const { rerender } = renderHook(
      (state) =>
        useUpdateEffect(() => {
          mountState = 2;
        }, [state.a]),
      {
        initialProps: { a: [] },
      }
    );
    expect(mountState).toBe(1);

    rerender({ a: [] });

    expect(mountState).toBe(2);
  });

  it("依赖项不变", () => {
    let mountState = 1;
    const { rerender } = renderHook(() =>
      useUpdateEffect(() => {
        mountState = 2;
      })
    );
    expect(mountState).toBe(1);

    rerender();

    expect(mountState).toBe(2);
  });
});

describe("创建 useUpdateLayoutEffect", () => {
  const useUpdateEffect = createUpdateEffect(useLayoutEffect);

  it("渲染 useUpdateEffect, 依赖项变了才会渲染", () => {
    let mountState = 1;
    const { rerender } = renderHook(
      (state) =>
        useUpdateEffect(() => {
          mountState = 2;
        }, [state.a]),
      {
        initialProps: { a: [] },
      }
    );
    expect(mountState).toBe(1);

    rerender({ a: [] });

    expect(mountState).toBe(2);
  });

  it("依赖项不变", () => {
    let mountState = 1;
    const { rerender } = renderHook(() =>
      useUpdateEffect(() => {
        mountState = 2;
      })
    );
    expect(mountState).toBe(1);

    rerender();

    expect(mountState).toBe(2);
  });
});
