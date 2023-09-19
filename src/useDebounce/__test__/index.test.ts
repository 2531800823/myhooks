import { act, renderHook } from "@testing-library/react";
import useDebounce from "../index";
import { sleep } from "../../utils/testingHelpers";

describe("useDebounce", () => {
  it("测试值200ms", async () => {
    let count = 0;
    const { result, rerender } = renderHook(() =>
      useDebounce(count, { wait: 200 })
    );
    expect(result.current).toBe(0);

    count = 2;

    rerender();
    count = 3;
    rerender();

    expect(result.current).toBe(0);

    await act(async () => {
      await sleep(200);
    });
    expect(result.current).toBe(3);

    await act(async () => {
      await sleep(50);
      count = 5;
      rerender();
    });

    expect(result.current).toBe(3);

    await act(async () => {
      await sleep(200);
    });
    expect(result.current).toBe(5);
  });
});
