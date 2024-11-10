const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const libraryName = 'auto-type-cast'
const outputFile = `${libraryName}.js`

module.exports = {
  entry: {
    app: './src/index.js'
  },
  devtool: 'source-map',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  resolve: {
    alias: require('./aliases.config.js').webpack
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    open: true,
    hot: true
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true
        }
      })
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js'],
      exclude: 'node_modules'
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  }
};
