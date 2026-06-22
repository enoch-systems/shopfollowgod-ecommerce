import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { pwaConfig } from './src/pwa.js';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    pwaConfig,
  ],
  base: './',  // correct for repo-named GitHub Pages (e.g. /shopfollowgod-shopping-site/)
});
