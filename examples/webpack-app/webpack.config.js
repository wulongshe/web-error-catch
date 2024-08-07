import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UploadSourceMapPlugin from '@dt-wec/plugin-webpack';

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
      url: 'http://localhost:8080/upload',
    }),
  ],
  // devtool: 'source-map',
};
