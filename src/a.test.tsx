import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("loads and displays greeting", async () => {
  // ARRANGE
  const { container, getByRole } = render(<App />);
  const div = container.querySelector(".card button");
  const count = getByRole("count");

  //   获取属性 值 是否为 0 ，html 内容都是 string
  expect(count.textContent).toBe("0");
  // 触发函数点击
  fireEvent.click(div as HTMLDivElement);
  //   判断点击后 值
  expect(count.textContent).toBe("1");

  expect(1).toBe(1);
});
