import { Class } from "./classRegistry";

interface TransformMap {
  [propertyKey: string]: (value: unknown) => unknown;
}

interface TransformRegistry {
  [className: string]: TransformMap;
}

const transformRegistry: TransformRegistry = {};

export function registerTransform(
  target: Class,
  propertyKey: string,
  transformFn: (value: unknown) => unknown,
): void {
  const className = target.name;
  transformRegistry[className] = transformRegistry[className] || {};
  transformRegistry[className][propertyKey] = transformFn;
}

export function getTransforms(className: string): TransformMap {
  return transformRegistry[className] || {};
}

export { transformRegistry };
export type { TransformMap, TransformRegistry };
