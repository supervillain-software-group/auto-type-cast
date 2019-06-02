import config, { defaultConfig } from  '../../src/config';

const resetConfig = () => Object.assign(config, defaultConfig);
beforeEach(resetConfig);
