import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React-related libs into a dedicated chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split image rendering library
          'image-vendor': ['html-to-image'],
          // Split icon library
          'icons-vendor': ['lucide-react']
        }
      }
    },
    // Use esbuild for fast minification
    minify: 'esbuild',
    // CSS code splitting
    cssCodeSplit: true,
    // Chunk size warning threshold
    chunkSizeWarningLimit: 1000,
    // Disable sourcemaps to reduce output size
    sourcemap: false,
    // Enable CSS minification
    cssMinify: true
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'html-to-image']
  },
  // esbuild options
  esbuild: {
    // Drop console and debugger statements in production
    drop: ['console', 'debugger']
  }
});
