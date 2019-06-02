const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../'),
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: require('../aliases.config.js').jest,
  setupFilesAfterEnv: ['<rootDir>/test/setup/configSetup.js'],
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
