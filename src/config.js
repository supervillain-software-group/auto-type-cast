const NO_OP = (object) => {}; // eslint-disable-line no-unused-vars

const defaultConfig = {
  typeKey: '__type',
  getObjectType: (object, options) => {
    const typeKey = options.typeKey || config.typeKey;
    return object[typeKey];
  },
  getClassType: (klass) => klass.registeredName || klass.name,
  beforeTypeCast: NO_OP,
  afterTypeCast: NO_OP,
  onTransformError: (error, propertyKey, value, transformFn, type) => {
    console.warn(
      `Transform failed for ${type}.${propertyKey}:`,
      error.message,
      '\nFalling back to original value:',
      value
    );
  }
};

const config = {};
Object.assign(config, defaultConfig);

export default config;
export { defaultConfig };
