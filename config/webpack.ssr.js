const baseConfig = require('./webpack.config')
const merge = require('webpack-merge')
const path = require('path')
const nodeExternals = require('webpack-node-externals');

const config = merge(baseConfig(), {
  entry: path.resolve(__dirname, '..', 'src/index.ssr.js'),
  target: 'node',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/static',
    filename: 'index.ssr.js',
    devtoolModuleFilenameTemplate: (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
  },
  externals: [nodeExternals()],
})

module.exports = config



