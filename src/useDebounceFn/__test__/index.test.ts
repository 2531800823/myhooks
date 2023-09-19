import { act, renderHook, RenderHookResult } from "@testing-library/react";
import useDebounceFn from "..";
import { sleep } from "../../utils/testingHelpers";

interface ParamsObj {
  fn: (...arg: any) => any;
  deps?: any[];
  wait: number;
}

let count = 0;
const debouceFn = (gap: number) => {
  count += gap;
};

const setUp = ({ fn, wait }: ParamsObj) => {
  return renderHook(() => {
    return useDebounceFn(fn, { wait });
  });
};

let hook: RenderHookResult<any, any>;

describe("useDebounceFn", () => {
  it("cancel", async () => {
    act(() => {
      hook = setUp({
        fn: debouceFn,
        wait: 200,
      });
    });

    await act(async () => {
      // 测试防抖
      hook.result.current.run(2);
      hook.result.current.run(2);
      hook.result.current.run(2);
      hook.result.current.run(2);
      hook.result.current.run(2);
      expect(count).toBe(0);

      await sleep(300);

      expect(count).toBe(2);

      hook.result.current.run(2);
      expect(count).toBe(2);
      await sleep(300);
      expect(count).toBe(4);

      // 测试 cancel
      hook.result.current.run(2);
      hook.result.current.run(2);
      hook.result.current.cancel();
      expect(count).toBe(4);

      // 测试立即调用
      hook.result.current.run(3);
      hook.result.current.flush();

      expect(count).toBe(7);

      // 测试卸载区间是否 cancel
      hook.result.current.run(2);
      hook.unmount();
      expect(count).toBe(7);
    });
  });

  it.skip("传入错误的参数", () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    renderHook(() => useDebounceFn(1 as any));
    expect(errSpy).toBeCalledWith(
      "useDebounceFn 第一个参数需要一个函数, 你传入的 number"
    );
    errSpy.mockRestore();
  });
});
