'use strict';
import path from 'path'
import webpack from 'webpack'

const rel_path = suffix => path.resolve(__dirname, suffix);

export const configuration = {
  entry: {
    'jspath-mutator': './src/js/Mutator.js'
  },
  output: {
    path: rel_path('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].js'
  },

  devtool: 'source-map',

  cache: true,

  devServer: {
    contentBase: rel_path('dist')
  },

  stats: {
    colors: true,
    reasons: true
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?cacheDirectory'],
        include: [rel_path('src/js'), rel_path('test')],
        exclude: /(node_modules|bower_components)/
      }
    ]
  },

  resolve: {
    modulesDirectories: ['src/js', 'node_modules'],
    packageAlias: "browser",
    alias: {}
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  node: {
    fs: "empty"
  }
};

export default configuration
