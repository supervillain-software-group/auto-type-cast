const classRegistry = { };

const registerClass = (c) => { classRegistry[c.name] = c; };

export { classRegistry, registerClass };
