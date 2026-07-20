import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: false,
    https: true,
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@core': resolve(__dirname, './src/core'),
      '@modules': resolve(__dirname, './src/modules'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
  },
});
