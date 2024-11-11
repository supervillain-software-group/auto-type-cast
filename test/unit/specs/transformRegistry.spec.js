import autoTypeCast from '../../../src/autoTypeCast';
import { classRegistry } from '../../../src/classRegistry';
import config from '../../../src/config';
import { Register, Transform } from '../../../src/decorators';
import { transformRegistry } from '../../../src/transformRegistry';

describe('Transform decorator', () => {
  beforeEach(() => {
    // Clear registries before each test
    Object.keys(classRegistry).forEach((key) => delete classRegistry[key]);
    Object.keys(transformRegistry).forEach((key) => delete transformRegistry[key]);
  });

  it('transforms properties using the specified function', () => {
    @Register('Person')
    // eslint-disable-next-line no-unused-vars
    class Person {
      @Transform((dateStr) => {
        const date = new Date(dateStr);
        // Ensure timezone doesn't affect the test
        date.setUTCHours(0, 0, 0, 0);
        return date;
      })
      birthDate;

      @Transform((str) => str.toUpperCase())
      name;
    }

    const data = {
      __type: 'Person',
      birthDate: '1990-01-01',
      name: 'Homer Simpson',
    };

    autoTypeCast(data);

    expect(data.birthDate instanceof Date).toBe(true);
    expect(data.birthDate.getUTCFullYear()).toBe(1990);
    expect(data.name).toBe('HOMER SIMPSON');
  });

  it('handles nested objects with transformations', () => {
    @Register('Food')
    // eslint-disable-next-line no-unused-vars
    class Food {
      @Transform((str) => str.toLowerCase())
      category;
    }

    @Register('Person')
    // eslint-disable-next-line no-unused-vars
    class Person {
      foods;
    }

    const data = {
      __type: 'Person',
      foods: [
        { __type: 'Food', category: 'DONUT', name: 'Jelly' },
        { __type: 'Food', category: 'PIZZA', name: 'Pepperoni' },
      ],
    };

    autoTypeCast(data);

    expect(data.foods[0].category).toBe('donut');
    expect(data.foods[1].category).toBe('pizza');
  });

  it('should not call transform for null or undefined values', () => {
    let transformCalled = false;

    @Register('Person')
    // eslint-disable-next-line no-unused-vars
    class Person {
      @Transform((value) => {
        transformCalled = true;
        return value;
      })
      name;

      @Transform((value) => {
        transformCalled = true;
        return value;
      })
      age;
    }

    const data = {
      __type: 'Person',
      name: null,
      age: undefined,
    };

    autoTypeCast(data);

    // Transform function should not be called for either null or undefined
    expect(transformCalled).toBe(false);

    // Values should remain unchanged
    expect(data.name).toBe(null);
    expect(data.age).toBe(undefined);
  });

  describe('error handling', () => {
    let errorHandlerCalled;
    let errorDetails;
    const originalOnTransformError = config.onTransformError;

    beforeEach(() => {
      errorHandlerCalled = false;
      errorDetails = null;
      // Reset to default error handler
      config.onTransformError = originalOnTransformError;
    });

    it('preserves original value when transform fails', () => {
      @Register('User')
      // eslint-disable-next-line no-unused-vars
      class User {
        @Transform(() => {
          throw new Error('Transform failed');
        })
        createdAt;

        @Transform((str) => str.toUpperCase())
        name;
      }

      const data = {
        __type: 'User',
        createdAt: '2023-01-01',
        name: 'test',
      };

      autoTypeCast(data);

      // Original value should be preserved
      expect(data.createdAt).toBe('2023-01-01');
      // Other transforms should still work
      expect(data.name).toBe('TEST');
    });

    it('calls global error handler when transform fails', () => {
      config.onTransformError = (error, prop, value, fn, type) => {
        errorHandlerCalled = true;
        errorDetails = { error, prop, value, type };
      };

      @Register('User')
      // eslint-disable-next-line no-unused-vars
      class User {
        @Transform(() => {
          throw new Error('Transform failed');
        })
        createdAt;
      }

      const data = {
        __type: 'User',
        createdAt: '2023-01-01',
      };

      autoTypeCast(data);

      expect(errorHandlerCalled).toBe(true);
      expect(errorDetails.prop).toBe('createdAt');
      expect(errorDetails.value).toBe('2023-01-01');
      expect(errorDetails.type).toBe('User');
      expect(errorDetails.error.message).toBe('Transform failed');
    });

    it('uses per-call error handler over global handler', () => {
      let globalCalled = false;
      let perCallCalled = false;

      config.onTransformError = () => {
        globalCalled = true;
      };

      @Register('User')
      // eslint-disable-next-line no-unused-vars
      class User {
        @Transform(() => {
          throw new Error('Transform failed');
        })
        createdAt;
      }

      const data = {
        __type: 'User',
        createdAt: '2023-01-01',
      };

      autoTypeCast(data, {
        onTransformError: () => {
          perCallCalled = true;
        },
      });

      expect(globalCalled).toBe(false);
      expect(perCallCalled).toBe(true);
    });

    it('continues type casting after transform error', () => {
      @Register('User')
      // eslint-disable-next-line no-unused-vars
      class User {
        @Transform(() => {
          throw new Error('First transform failed');
        })
        first;

        @Transform(() => {
          throw new Error('Second transform failed');
        })
        second;

        @Transform((str) => str.toUpperCase())
        third;
      }

      const data = {
        __type: 'User',
        first: 'one',
        second: 'two',
        third: 'three',
      };

      autoTypeCast(data);

      // Original values preserved for failed transforms
      expect(data.first).toBe('one');
      expect(data.second).toBe('two');
      // Successful transform still applied
      expect(data.third).toBe('THREE');
    });
  });
});
