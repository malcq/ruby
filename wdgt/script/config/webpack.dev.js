const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');

const { createLoaders } = require('./utils');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist',
    host: '0.0.0.0'
  },
  module: {
    rules: createLoaders({ development: true })
  },
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('development'),
    })
  ]
});
