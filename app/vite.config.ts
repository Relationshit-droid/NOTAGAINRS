import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  plugins: [
    removeConsole(),
  ],
  envPrefix: 'EXPO_PUBLIC_',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
