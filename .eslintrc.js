// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties']
      ]
    }
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    "airbnb-base"
  ],
  // add your custom rules here
  rules: {
    'no-cond-assign': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    // allow decorators
    'new-cap': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
