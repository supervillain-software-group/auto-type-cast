const NO_OP = (object) => { }; // eslint-disable-line no-unused-vars

const defaultConfig = {
  typeKey: '__type',
  getObjectType: (object, options) => {
    const typeKey = options.typeKey || config.typeKey;
    return object[typeKey];
  },
  getClassType: klass => klass.name,
  beforeTypeCast: NO_OP,
  afterTypeCast: NO_OP,
};

const config = {};
Object.assign(config, defaultConfig);

export default config;
export { defaultConfig };
