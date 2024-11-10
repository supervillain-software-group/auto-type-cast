import autoTypeCast from './autoTypeCast';
import { classRegistry, registerClass } from './classRegistry';
import config, { defaultConfig } from './config';
import { Register, Transform } from './decorators';

export default autoTypeCast;
export { classRegistry, config, defaultConfig, Register, registerClass, Transform };
