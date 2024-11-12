import { Class, registerClass } from "./classRegistry";
import { registerTransform } from "./transformRegistry";

interface RegisteredClass extends Class {
  registeredName: string;
}

const Register = (name: string) =>
  function decorator<T extends Class>(target: T): T & RegisteredClass {
    Object.defineProperty(target, "registeredName", {
      value: name,
      writable: false,
      configurable: false,
    });

    registerClass(target as T & RegisteredClass);

    return target as T & RegisteredClass;
  };

const Transform = (transformFn: (value: unknown) => unknown) =>
  function decorator(target: object, propertyKey: string | symbol): void {
    registerTransform(
      target.constructor as Class,
      propertyKey.toString(),
      transformFn,
    );
  };

export { Register, Transform };
export type { RegisteredClass };
