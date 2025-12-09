import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allows access from network
    open: true, // Opens browser automatically
  },
  build: {
    outDir: 'dist',
  }
});