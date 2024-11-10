// Store transformations for each class's properties
// Format: { className: { propertyName: transformFn } }
const transformRegistry = {};

export function registerTransform(target, propertyKey, transformFn) {
  const className = target.constructor.name;
  transformRegistry[className] = transformRegistry[className] || {};
  transformRegistry[className][propertyKey] = transformFn;
}

export function getTransforms(className) {
  return transformRegistry[className] || {};
}

export { transformRegistry };
