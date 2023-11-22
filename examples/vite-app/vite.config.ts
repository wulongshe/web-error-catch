import { defineConfig } from 'vite';
import UploadSourceMapPlugin from '@wec/plugin-vite';

export default defineConfig({
  build: {
    // sourcemap: true,
  },
  plugins: [
    UploadSourceMapPlugin({
      url: 'http://localhost:8000/upload/source-map',
    }),
  ],
});
