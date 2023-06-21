import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';


/** @type {import('vite').UserConfig} */
export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react(), eslint()],
  };
});
