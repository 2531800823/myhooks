import createUpdateEffect from "@/createUpdateEffect";
import { useEffect } from "react";

/**
 * useUpdateEffect 用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行。
 */
export default createUpdateEffect(useEffect);
