/**
 * 判断是否是 dev 环境 test 也是dev
 */
const isDev =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

export default isDev;
