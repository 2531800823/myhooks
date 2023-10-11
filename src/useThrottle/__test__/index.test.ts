import { act, renderHook } from "@testing-library/react";
import useThrottle from "..";
import { sleep } from "../../utils/testingHelpers";

let hook: any;
describe("useThrottle", () => {
  it("默认", async () => {
    let mountedState = 1;
    act(() => {
      hook = renderHook(() => useThrottle(mountedState, { wait: 500 }));
    });

    expect(hook?.result.current).toBe(1);
    mountedState = 2;
    hook.rerender();
    mountedState = 3;
    hook.rerender();
    await act(async () => {
      await sleep(250);
    });

    expect(hook?.result.current).toBe(1);
    mountedState = 4;
    hook.rerender();
    await act(async () => {
      await sleep(260);
    });

    expect(hook?.result.current).toBe(4);
  });
});
