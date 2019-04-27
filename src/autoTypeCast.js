import { classRegistry } from './classRegistry';

const TYPE_KEY_NAME = '__type';

// thanks jayrowe!
function autoTypeCastIterable(iterable, options) {
  const iterator = iterable[Symbol.iterator]();
  let current;

  while (!(current = iterator.next()).done) {
    autoTypeCast(current.value, options);
  }

  return iterable;
}

function autoTypeCast(obj, options = {}) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  const typeKey = options.typeKey || TYPE_KEY_NAME;

  if (typeof obj[Symbol.iterator] === 'function' && obj.constructor.name !== 'String') {
    return autoTypeCastIterable(obj, options);
  }

  if (obj.constructor.name === 'Object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === typeKey) return;
      autoTypeCast(value, options);
    });

    // todo: options could specify alternate or additional class registry
    const type = classRegistry[obj[typeKey]];
    if (type) {
      // todo: options could specify before/after/around autoTypeCast
      // todo: class could specify before/after/around autoTypeCast
      Object.setPrototypeOf(obj, type.prototype);
    }
    // todo: else if has key but no type found and option is set, throw error
  }

  return obj;
}

export default autoTypeCast;
export { classRegistry };
