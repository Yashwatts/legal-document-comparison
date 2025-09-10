import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Look for index.html in project root
  build: {
    outDir: 'dist', // Output to root/dist
    emptyOutDir: true // Clear dist folder
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
});