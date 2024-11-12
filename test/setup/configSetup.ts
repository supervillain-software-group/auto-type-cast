import config, { defaultConfig, TypeCastConfig } from "../../src/config";

const resetConfig = (): TypeCastConfig => Object.assign(config, defaultConfig);
beforeEach(resetConfig);
