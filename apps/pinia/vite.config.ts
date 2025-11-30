import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@vue-state-lab/types': path.resolve(__dirname, '../../packages/types/src'),
      '@vue-state-lab/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@vue-state-lab/api': path.resolve(__dirname, '../../packages/api/src'),
      '@vue-state-lab/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    port: 3004,
    host: true, // Listen on all addresses, including 0.0.0.0
  },
});

