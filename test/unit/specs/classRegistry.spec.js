import { classRegistry, registerClass } from '../../../src/classRegistry';
import config from '../../../src/config';

describe('classRegistry', () => {
  test('object exists', () => {
    expect(typeof classRegistry).toBe('object');
  });
});

describe('registerClass', () => {
  test('adds a class to the registry by its name', () => {
    class TestRegisterClass {}

    registerClass(TestRegisterClass);

    expect(classRegistry.TestRegisterClass).toEqual(TestRegisterClass);
  });

  test('adds a class to registry when name is overridden', () => {
    class TestCustomNameClass { static get name() { return 'CustomName'; } }

    registerClass(TestCustomNameClass);

    expect(classRegistry.CustomName).toEqual(TestCustomNameClass);
  });

  test('adds a class to the registry by custom function', () => {
    class TestCustomFnClass { static typeName() { return 'CustomFn'; } }

    config.getClassType = klass => klass.typeName();
    registerClass(TestCustomFnClass);

    expect(classRegistry.CustomFn).toEqual(TestCustomFnClass);
  });
});
