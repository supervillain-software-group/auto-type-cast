import { registerClass } from './classRegistry';

const Register = name => function decorator(target) {
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

export default Register;
