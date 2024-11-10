import { registerClass } from './classRegistry';
import { registerTransform } from './transformRegistry';

const Register = (name) =>
  function decorator(target) {
    // Store the registration name on the class
    Object.defineProperty(target, 'registeredName', {
      value: name,
      writable: false,
      configurable: false,
    });

    // Register the class with our custom name
    registerClass(target);

    return target;
  };

const Transform = (transformFn) =>
  function decorator(target, propertyKey) {
    // Register the transformation function for this property
    registerTransform(target, propertyKey, transformFn);
  };

export { Register, Transform };
