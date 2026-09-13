import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
      },
      '/classic': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
      },
      '/maintenance': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
