import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // 将 /api/xxx 代理到后端的 /xxx
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
});
