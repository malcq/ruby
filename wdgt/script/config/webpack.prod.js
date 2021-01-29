const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

const common = require('./webpack.common');
const { createLoaders } = require('./utils');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.join(__dirname, '../../server/public/script'),
    filename: 'bundle.js',
  },  
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        terserOptions: {
          output: {
            comments: false
          }
        }
      }),
    ]
  },
  module: {
    rules: createLoaders({ development: false }),
  },
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('production'),
    })
  ]
});
