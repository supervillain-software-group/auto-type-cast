import { Class } from "./classRegistry";
import { RegisteredClass } from "./decorators";

interface TypeCastConfig {
  typeKey: string;
  getObjectType: (
    object: object,
    options: { typeKey?: string },
  ) => string | undefined;
  getClassType: (klass: Class | RegisteredClass) => string;
  beforeTypeCast: (object: object) => void;
  afterTypeCast: (object: object) => void;
  onTransformError: (
    error: Error,
    propertyKey: string,
    value: unknown,
    transformFn: (value: unknown) => unknown,
    type: string,
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NO_OP = (object: object): void => {};

const defaultConfig: TypeCastConfig = {
  typeKey: "__type",
  getObjectType: (
    object: object,
    options: { typeKey?: string },
  ): string | undefined => {
    const typeKey = options.typeKey || config.typeKey;
    return (object as Record<string, unknown>)[typeKey] as string | undefined;
  },
  getClassType: (klass: Class | RegisteredClass): string =>
    "registeredName" in klass ? klass.registeredName : klass.name,
  beforeTypeCast: NO_OP,
  afterTypeCast: NO_OP,
  onTransformError: (
    error: Error,
    propertyKey: string,
    value: unknown,
    transformFn: (value: unknown) => unknown,
    type: string,
  ): void => {
    console.warn(
      `Transform failed for ${type}.${propertyKey}:`,
      error.message,
      "\nFalling back to original value:",
      value,
    );
  },
};

const config: TypeCastConfig = {} as TypeCastConfig;
Object.assign(config, defaultConfig);

export default config;
export { defaultConfig };
export type { TypeCastConfig };
