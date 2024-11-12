import { classRegistry } from "./classRegistry";
import config, { TypeCastConfig } from "./config";
import { getTransforms } from "./transformRegistry";

interface AutoTypeCastOptions extends Partial<TypeCastConfig> {
  typeKey?: string;
}

function applyTransformations(
  obj: object,
  type: string,
  options: AutoTypeCastOptions,
): void {
  const transforms = getTransforms(type);
  const transformedProps: Record<string, unknown> = {};

  Object.entries(transforms).forEach(([prop, transformFn]) => {
    const value = (obj as Record<string, unknown>)[prop];
    if (value !== undefined && value !== null) {
      try {
        transformedProps[prop] = transformFn(value);
      } catch (error) {
        (options.onTransformError || config.onTransformError)?.(
          error as Error,
          prop,
          value,
          transformFn,
          type,
        );
        transformedProps[prop] = value;
      }
    }
  });

  Object.assign(obj, transformedProps);
}

function autoTypeCast(
  obj: unknown,
  options: AutoTypeCastOptions = {},
): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return autoTypeCastIterable(obj, options);
  }

  if (obj && typeof obj === "object" && obj.constructor.name === "Object") {
    const plainObj = obj as object;
    Object.values(plainObj as Record<string, unknown>).forEach((value) =>
      autoTypeCast(value, options),
    );

    const type = config.getObjectType(plainObj, options);
    if (type && classRegistry[type]) {
      (options.beforeTypeCast || config.beforeTypeCast)(plainObj);
      Object.setPrototypeOf(plainObj, classRegistry[type].prototype);
      applyTransformations(plainObj, type, options);
      (options.afterTypeCast || config.afterTypeCast)(plainObj);
    }
  }

  return obj;
}

function autoTypeCastIterable(
  arr: unknown[],
  options: AutoTypeCastOptions,
): unknown[] {
  arr.forEach((value, index) => {
    arr[index] = autoTypeCast(value, options);
  });
  return arr;
}

export default autoTypeCast;
export { classRegistry };
export type { AutoTypeCastOptions };
