import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@/components/overlays', replacement: path.resolve(__dirname, 'src/components/ui/overlays') },
      { find: '@/components/feedback', replacement: path.resolve(__dirname, 'src/components/ui/feedback') },
      { find: '@/components/composites', replacement: path.resolve(__dirname, 'src/components/ui/composites') },
      { find: '@/components/primitives', replacement: path.resolve(__dirname, 'src/components/ui/primitives') },
      { find: '@/components/navigation', replacement: path.resolve(__dirname, 'src/components/ui/navigation') },
      { find: '@/components/Modals', replacement: path.resolve(__dirname, 'src/components/ui/overlays') },
      { find: '@/components/Sidebar', replacement: path.resolve(__dirname, 'src/components/layout/Sidebar') },
      { find: '@/components/Stats', replacement: path.resolve(__dirname, 'src/components/ui/composites') },
      { find: '@/components/layout', replacement: path.resolve(__dirname, 'src/components/layout') },
      { find: '@/components/shared', replacement: path.resolve(__dirname, 'src/components/shared') },
      { find: '@/context', replacement: path.resolve(__dirname, 'src/contexts') },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
});
