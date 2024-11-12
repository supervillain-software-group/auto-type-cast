import config from "./config";

interface Class {
  prototype: object;
  name: string;
}

interface ClassRegistry {
  [type: string]: Class;
}

const classRegistry: ClassRegistry = {};

const registerClass = (c: Class): void => {
  const type = config.getClassType(c);
  classRegistry[type] = c;
};

export { classRegistry, registerClass };
export type { Class, ClassRegistry };
