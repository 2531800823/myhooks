/**
 * 异步阻塞 n 秒
 * @param timer  单位ms
 * @returns
 */
export function sleep(timer: number) {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, timer);
  });
}

/**
 * 模拟一个异步
 * @param req 0 就是失败，其他成功
 * @returns
 */
export function request(req: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (req === 0) {
        reject(new Error("fial"));
      } else {
        resolve("success");
      }
    }, 1000);
  });
}
