import config from './config';

const classRegistry = {};

const registerClass = (c) => {
  const type = config.getClassType(c);
  classRegistry[type] = c;
};

export { classRegistry, registerClass };
