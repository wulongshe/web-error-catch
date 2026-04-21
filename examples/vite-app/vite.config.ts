import { defineConfig, type PluginOption } from 'vite';
import UploadSourceMapPlugin from '@dt-wec/plugin-vite';

export default defineConfig({
  build: {
    // sourcemap: true,
  },
  plugins: [
    UploadSourceMapPlugin({
      url: 'http://127.0.0.1:8000/upload',
      project: 'tourmind_cn/ebk-web',
    }) as PluginOption,
  ],
});
