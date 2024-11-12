const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../'),
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.ts$': ['babel-jest', { presets: ['@babel/preset-typescript'] }],
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: require('../aliases.config.js').jest,
  setupFilesAfterEnv: ['<rootDir>/test/setup/configSetup.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
