import { isFunction, isNumber, isObject, isString, isUndefined } from "..";

describe("测试 类型", () => {
  test("测试对象", () => {
    expect(isObject("1")).toBeFalsy;
    expect(isObject(1)).toBeFalsy;
    expect(isObject(false)).toBeFalsy;
    expect(isObject(() => {})).toBeFalsy;
    expect(isObject(null)).toBeFalsy;
    expect(isObject(undefined)).toBeFalsy;
    expect(isObject([])).toBeFalsy;
    expect(isObject({})).toBeTruthy;
    expect(new Date()).toBeTruthy;
    expect(new RegExp("")).toBeTruthy;
    expect(new Object()).toBeTruthy;
  });

  test("测试 function", () => {
    expect(isFunction(() => {})).toBeTruthy;
    expect(function () {}).toBeTruthy;
    expect(isFunction("1")).toBeFalsy;
    expect(isFunction(1)).toBeFalsy;
    expect(isFunction(false)).toBeFalsy;
    expect(isFunction(null)).toBeFalsy;
    expect(isFunction(undefined)).toBeFalsy;
    expect(isFunction([])).toBeFalsy;
    expect(isFunction({})).toBeFalsy;
  });

  test("测试 string", () => {
    expect(isString("1")).toBeTruthy;
    expect(new String("")).toBeTruthy;
    expect(isString(1)).toBeFalsy;
    expect(isString(false)).toBeFalsy;
    expect(isString(() => {})).toBeFalsy;
    expect(isString(undefined)).toBeFalsy;
    expect(isString(null)).toBeFalsy;
    expect(isString([])).toBeFalsy;
    expect(isString({})).toBeFalsy;
  });
  test("测试 number", () => {
    expect(isNumber(1)).toBeTruthy;
    expect(new Number(1)).toBeTruthy;
    expect(1.23).toBeTruthy;
    expect(Infinity).toBeTruthy;
    expect(NaN).toBeTruthy;

    expect(isNumber("1")).toBeFalsy;
    expect(isNumber(false)).toBeFalsy;
    expect(isNumber(() => {})).toBeFalsy;
    expect(isNumber(undefined)).toBeFalsy;
    expect(isNumber(null)).toBeFalsy;
    expect(isNumber([])).toBeFalsy;
    expect(isNumber({})).toBeFalsy;
  });
  test("测试 undefined", () => {
    expect(isUndefined(undefined)).toBeTruthy;
    expect(NaN).toBeFalsy;
    expect(0).toBeFalsy;
    expect("").toBeFalsy;
    expect(null).toBeFalsy;

    expect(isUndefined(() => {})).toBeFalsy;
    expect(isUndefined("1")).toBeFalsy;
    expect(isUndefined(1)).toBeFalsy;
    expect(isUndefined(false)).toBeFalsy;
    expect(isUndefined(null)).toBeFalsy;
    expect(isUndefined({})).toBeFalsy;
    expect(isUndefined([])).toBeFalsy;
  });
});
