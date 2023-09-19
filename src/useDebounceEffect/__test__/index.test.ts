import { sleep } from "@/utils/testingHelpers";
import { act, renderHook } from "@testing-library/react";
import useDebounceEffect from "../index";
describe("useDebounceEffect", () => {
  it("正常防抖和卸载防抖", async () => {
    const mockEffect = jest.fn();
    const mockUnEffect = jest.fn();
    let count = 1;
    const { rerender } = renderHook(() =>
      useDebounceEffect(
        () => {
          mockEffect();
          return () => {
            mockUnEffect();
          };
        },
        [count],
        { wait: 200 }
      )
    );

    expect(mockEffect).toHaveBeenCalledTimes(0);
    expect(mockUnEffect).toHaveBeenCalledTimes(0);

    // 更改依赖，渲染
    count = 2;
    rerender();

    await act(async () => {
      await sleep(200);
    });

    // 等待防抖过去，更改
    expect(mockEffect).toHaveBeenCalledTimes(1);
    expect(mockUnEffect).toHaveBeenCalledTimes(0);

    count = 3;
    rerender();

    await act(async () => {
      await sleep(50);
    });

    // 防抖不过，不变
    expect(mockEffect).toHaveBeenCalledTimes(1);
    expect(mockUnEffect).toHaveBeenCalledTimes(0);

    await act(async () => {
      await sleep(200);
    });

    expect(mockEffect).toHaveBeenCalledTimes(2);
    expect(mockUnEffect).toHaveBeenCalledTimes(1);

    count = 4;
    rerender();

    count = 5;
    rerender();

    // 防抖内，更改2次
    await act(async () => {
      await sleep(200);
    });
    expect(mockEffect).toHaveBeenCalledTimes(3);
    expect(mockUnEffect).toHaveBeenCalledTimes(2);
  });

  it("测试 卸载组件 cacel", async () => {
    const mockEffect = jest.fn();
    const mockUnEffect = jest.fn();
    const { rerender, unmount } = renderHook(
      (props) =>
        useDebounceEffect(
          () => {
            mockEffect();
            return () => {
              mockUnEffect();
            };
          },
          [props],
          { wait: 200 }
        ),
      {
        initialProps: 0,
      }
    );

    expect(mockEffect).toHaveBeenCalledTimes(0);
    expect(mockUnEffect).toHaveBeenCalledTimes(0);

    rerender(1);

    // 等待防抖过去，更改
    await act(async () => {
      await sleep(200);
    });

    expect(mockEffect).toHaveBeenCalledTimes(1);
    expect(mockUnEffect).toHaveBeenCalledTimes(0);

    rerender(2);

    await act(async () => {
      await sleep(100);
    });

    rerender(3);

    await act(async () => {
      await sleep(300);
    });

    expect(mockEffect).toHaveBeenCalledTimes(2);
    expect(mockUnEffect).toHaveBeenCalledTimes(1);

    rerender(4);
    rerender(5);
    unmount();

    expect(mockEffect).toHaveBeenCalledTimes(2);
    expect(mockUnEffect).toHaveBeenCalledTimes(2);
  });
});
