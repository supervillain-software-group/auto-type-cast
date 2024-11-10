import { classRegistry, registerClass } from '../../../src/classRegistry';
import config from '../../../src/config';
import Register from '../../../src/decorators';

describe('classRegistry', () => {
  test('object exists', () => {
    expect(typeof classRegistry).toBe('object');
  });
});

describe('registerClass', () => {
  beforeEach(() => {
    // Clear registry before each test
    Object.keys(classRegistry).forEach(key => delete classRegistry[key]);
  });

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

    const originalGetClassType = config.getClassType;
    config.getClassType = klass => klass.typeName();
    registerClass(TestCustomFnClass);
    config.getClassType = originalGetClassType;

    expect(classRegistry.CustomFn).toEqual(TestCustomFnClass);
  });
});

describe('Register decorator', () => {
  beforeEach(() => {
    // Clear registry before each test
    Object.keys(classRegistry).forEach(key => delete classRegistry[key]);
  });

  test('registers class with custom name using decorator', () => {
    @Register('CustomPerson')
    class Person {}

    expect(classRegistry.CustomPerson).toEqual(Person);
    expect(Person.registeredName).toBe('CustomPerson');
  });

  test('registered name takes precedence over class name', () => {
    @Register('CustomName')
    class TestClass { static get name() { return 'ClassName'; } }

    expect(classRegistry.CustomName).toEqual(TestClass);
    expect(classRegistry.ClassName).toBeUndefined();
  });
});
