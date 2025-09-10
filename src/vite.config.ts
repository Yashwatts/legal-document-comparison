import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist', // Output to root/dist
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/Uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  root: 'src' // Specify index.html location
});