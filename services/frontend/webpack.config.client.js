/** @format */

const path = require('path');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  name: 'client',
  entry: [
    "webpack-dev-server/client?http://127.0.0.0:8085",
    "webpack/hot/only-dev-server",
    path.resolve(__dirname, 'src/index.tsx'),
  ],
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
  performance: { hints: false },
  devtool: 'inline-source-map',
  devServer: {
    port: 8085,
    hot: true,
    compress: true,
    watchFiles: ['src/*'],
    server: 'http',
    webSocketServer: 'ws',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin(),
    new DefinePlugin({
      'process.env': JSON.stringify({
        ENVIRONMENT: 'dev',
        HOSTNAME: 'dev',
        IP_ADDRESS: 'localhost',
      }),
    }),
  ],
};