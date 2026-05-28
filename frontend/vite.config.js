import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* images/ на корне фронтенда отдаются как статика (доступ: /имя_файла) */
export default defineConfig({
  plugins:   [react()],
  publicDir: 'images',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
