import { isEqual } from "lodash-es";
import { DependencyList } from "react";

export const depsEqual = (
  aDeps: DependencyList = [],
  bDeps: DependencyList = []
) => {
  return isEqual(aDeps, bDeps);
};
