/** @format */

const path = require('path');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  name: 'client',
  entry: {
    client: path.resolve(__dirname, 'src/index.tsx'),
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname + '/build'),
    filename: '[name].js',
    publicPath: '',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      // Preact override
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin(),
    new DefinePlugin({
      'process.env': JSON.stringify({
        HOSTNAME: process.env.HOSTNAME,
        IP_ADDRESS: process.env.IP_ADDRESS,
      }),
    }),
  ],
};