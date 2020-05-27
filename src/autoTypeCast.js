import { classRegistry } from './classRegistry';
import config from './config';

function autoTypeCast(obj, options = {}) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj[Symbol.iterator] === 'function' && obj.constructor.name !== 'String') {
    return autoTypeCastIterable(obj, options);
  }

  if (obj.constructor.name === 'Object') {
    Object.values(obj).forEach(value => autoTypeCast(value, options));

    // todo: options could specify alternate or additional class registry
    const type = config.getObjectType(obj, options);
    const objectClass = classRegistry[type];
    if (objectClass) {
      // todo: options could specify around autoTypeCast for canceling it
      // todo: class could specify before/after/around autoTypeCast
      (options.beforeTypeCast || config.beforeTypeCast)(obj);
      Object.setPrototypeOf(obj, objectClass.prototype);
      (options.afterTypeCast || config.afterTypeCast)(obj);
    }
    // todo: else if has key but no type found and option is set, throw error
  }

  return obj;
}

// thanks jayrowe!
function autoTypeCastIterable(iterable, options) {
  const iterator = iterable[Symbol.iterator]();
  let current;

  while (!(current = iterator.next()).done) {
    autoTypeCast(current.value, options);
  }

  return iterable;
}

export default autoTypeCast;
export { classRegistry };
