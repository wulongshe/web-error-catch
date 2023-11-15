import { defineConfig } from 'vite';
import UploadSourceMapPlugin from '@wec/plugin-vite';

export default defineConfig({
  // ...others config
  plugins: [
    UploadSourceMapPlugin({
      url: 'http://localhost:6000/upload/source-map',
    }),
  ],
});
