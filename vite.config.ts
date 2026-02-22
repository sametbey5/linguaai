import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // define specific key to avoid overwriting all of process.env
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});