import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UploadSourceMapPlugin from '@wec/plugin-webpack';

export default {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
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
      url: 'http://localhost:8000/upload/source-map',
    }),
  ],
  // devtool: 'source-map',
};
