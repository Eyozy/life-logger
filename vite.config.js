import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Exclude .woff files, keep only .woff2 for smaller bundle size
          if (assetInfo.name && assetInfo.name.endsWith('.woff') && !assetInfo.name.endsWith('.woff2')) {
            return 'excluded/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});
