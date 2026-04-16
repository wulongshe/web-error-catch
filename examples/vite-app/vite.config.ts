import { defineConfig, type PluginOption } from 'vite';
import UploadSourceMapPlugin from '@dt-wec/plugin-vite';

export default defineConfig({
  build: {
    // sourcemap: true,
  },
  plugins: [
    UploadSourceMapPlugin({
      url: 'http://localhost:3000/upload',
      project: 'vite-app',
    }) as PluginOption,
  ],
});
