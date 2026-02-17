import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the browser to match the code's usage
      'process.env': {
        API_KEY: env.API_KEY || env.VITE_API_KEY
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});