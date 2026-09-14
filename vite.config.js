import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        en: fileURLToPath(new URL('./index.html', import.meta.url)),
        de: fileURLToPath(new URL('./de/index.html', import.meta.url)),
        tr: fileURLToPath(new URL('./tr/index.html', import.meta.url)),
      },
    },
  },
});
