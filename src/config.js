const defaultConfig = {
  typeKey: '__type',
  getObjectType: (object, options) => {
    const typeKey = options.typeKey || config.typeKey;
    return object[typeKey];
  },
  getClassType: klass => klass.name,
  beforeTypeCast: (object) => { },
  afterTypeCast: (object) => { },
};

const config = {};
Object.assign(config, defaultConfig);

export default config;
export { defaultConfig };
