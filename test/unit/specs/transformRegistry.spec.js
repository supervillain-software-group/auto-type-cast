import autoTypeCast from '../../../src/autoTypeCast';
import { classRegistry } from '../../../src/classRegistry';
import { Register, Transform } from '../../../src/decorators';
import { transformRegistry } from '../../../src/transformRegistry';

describe('Transform decorator', () => {
  beforeEach(() => {
    // Clear registries before each test
    Object.keys(classRegistry).forEach(key => delete classRegistry[key]);
    Object.keys(transformRegistry).forEach(key => delete transformRegistry[key]);
  });

  it('transforms properties using the specified function', () => {
    @Register('Person')
    class Person {
      @Transform(dateStr => {
        const date = new Date(dateStr);
        // Ensure timezone doesn't affect the test
        date.setUTCHours(0, 0, 0, 0);
        return date;
      })
      birthDate;

      @Transform(str => str.toUpperCase())
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
    class Food {
      @Transform(str => str.toLowerCase())
      category;
    }

    @Register('Person')
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
});
