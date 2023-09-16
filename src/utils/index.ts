/** 判断 是否是一个 对象 */
export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === "object";

/** 判断 是否是一个 函数 */
export const isFunction = (value: unknown): value is (...ages: any) => any =>
  typeof value === "function";

/** 判断 是否是一个 字符串 */
export const isString = (val: unknown): val is string =>
  typeof val === "string";

/** 判断 是否是一个 布尔 */
export const isBoolean = (val: unknown): val is boolean =>
  typeof val === "boolean";

/** 判断 是否是一个 数字 */
export const isNumber = (val: unknown): val is number =>
  typeof val === "number";

/** 判断 是否是一个 undefined */
export const isUndefined = (val: unknown): val is undefined =>
  typeof val === "undefined";

// /** 判断不等于 null 和 undefined */
// export const notNullOrUndefined = (val: unknown): boolean =>
//   val !== null && val !== undefined;
