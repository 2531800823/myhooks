import { act, renderHook } from "@testing-library/react";
import useThrottleFn from "..";
import { sleep } from "../../utils/testingHelpers";

describe("useThrottleFn", () => {
  it("测试正常防抖", async () => {
    let count = 0;
    const { result } = renderHook(() => {
      return useThrottleFn(
        (gap: number) => {
          count += gap;
        },
        {
          wait: 500,
        }
      );
    });
    expect(count).toBe(0);

    result.current.run(1);
    result.current.run(2);
    result.current.run(3);
    result.current.run(4);

    expect(count).toBe(1);
    await act(async () => {
      await sleep(300);
      expect(count).toBe(1);

      result.current.run(3);
      result.current.run(1);

      await sleep(500);
      expect(count).toBe(2);

      result.current.run(1);
      result.current.run(2);
      result.current.run(3);
      result.current.run(4);
      result.current.cancel();

      expect(count).toBe(3);

      result.current.run(1);
      result.current.run(2);
      result.current.run(3);
      result.current.run(4);
      result.current.flush();
      expect(count).toBe(8);
    });
  });

  it("错误", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderHook(() => {
      useThrottleFn(1 as any);
    });

    expect(spy).toBeCalledWith(
      "useThrottle 第一个参数需要一个函数, 你传入的 number"
    );
  });
});
