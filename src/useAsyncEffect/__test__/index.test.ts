import { act, renderHook, waitFor } from "@testing-library/react";
import { useState } from "react";
import useAsyncEffect from "..";
import { sleep } from "../../utils/testingHelpers";

describe("useAsyncEffect", () => {
  it("判断异步是否可以调用", async () => {
    const { result, rerender } = renderHook(() => {
      const [stateCount, setCount] = useState(0);

      useAsyncEffect(async () => {
        await sleep(200);
        setCount(1);
      }, []);

      return stateCount;
    });

    expect(result.current).toBe(0);
    await act(async () => {
      await sleep(200);
    });
    //   等待 150 秒
    expect(result.current).toBe(1);
  });

  it("判断 yield", async () => {
    const { result } = renderHook(() => {
      const [x, setX] = useState(1);
      const [y, setY] = useState(0);

      useAsyncEffect(
        async function* () {
          await sleep(100);
          yield;
          console.log(1);
          setY(x);
        },
        [x]
      );

      return {
        y,
        setX,
      };
    });
    expect(result.current.y).toBe(0);

    await act(async () => {
      await sleep(50);
      // 等待 50 设置 x，然后 100 后设置 y
      result.current.setX(2);
    });

    expect(result.current.y).toBe(0);

    await act(async () => {
      await sleep(20);
    });
    expect(result.current.y).toBe(0);

    await act(async () => {
      await sleep(80);
    });
    // 发生变化
    expect(result.current.y).toBe(2);

    await act(async () => {
      await sleep(50);
      // 设置 3
      result.current.setX(3);
    });
    expect(result.current.y).toBe(2);

    await act(async () => {
      await sleep(80);
    });
    // 时间未到
    expect(result.current.y).toBe(2);

    await act(async () => {
      await sleep(30);
    });
    // 时间到了，变成3
    expect(result.current.y).toBe(3);
  });
});
