import { classRegistry, registerClass } from '../../../src/classRegistry';

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
});
