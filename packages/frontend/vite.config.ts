import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, '../../packages/shared/src/index.ts')
    },
  },
  build: {
    outDir: '../../dist/packages/frontend',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://fdf213jq7b.execute-api.us-west-2.amazonaws.com/prod/api')
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
