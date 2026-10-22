import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/decimaldrop/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    ...(mode === 'pages' ? { outDir: '../../decimaldrop', emptyOutDir: true } : {}),
    // Cache the stable UI dependencies separately from the growing question banks.
    rollupOptions: { output: { manualChunks(id) { if (id.includes('/node_modules/')) return 'vendor'; } } },
  },
}));
