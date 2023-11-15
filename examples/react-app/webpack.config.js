const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UploadSourceMapPlugin = require('@wec/plugin-webpack').default;

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new UploadSourceMapPlugin({
      url: 'http://localhost:6000/upload/source-map',
    }),
  ],
  devtool: 'source-map',
};
