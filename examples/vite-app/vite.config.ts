import { defineConfig } from 'vite';
import UploadSourceMapPlugin from '@dt-wec/plugin-vite';

export default defineConfig({
  build: {
    // sourcemap: true,
  },
  plugins: [
    UploadSourceMapPlugin({
      url: 'http://localhost:8080/upload',
    }),
  ],
});
