import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (
            id.includes('react-markdown') ||
            id.includes('remark-gfm') ||
            id.includes('rehype-highlight') ||
            id.includes('highlight.js')
          ) {
            return 'markdown-vendor';
          }

          if (
            id.includes('jspdf') ||
            id.includes('html2canvas') ||
            id.includes('html2pdf.js')
          ) {
            return 'pdf-vendor';
          }

          return undefined;
        },
      },
    },
  },
});
