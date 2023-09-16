import { renderHook } from "@testing-library/react";
import useUnmountedRef from "../index";
describe("useUnmountedRef", () => {
  it("测试 是否已经卸载", () => {
    const { rerender, unmount, result } = renderHook(() => useUnmountedRef());

    expect(result.current.current).toBeFalsy;
    rerender();
    expect(result.current.current).toBeFalsy;

    unmount();
    expect(result.current.current).toBeTruthy;
  });
});
