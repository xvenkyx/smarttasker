import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { webcrypto as crypto } from 'node:crypto';

export default defineConfig({
  plugins: [react()],
  define: {
    'global.crypto': crypto,
  },
});
