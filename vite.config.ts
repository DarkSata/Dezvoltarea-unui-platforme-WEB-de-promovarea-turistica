import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        destinatii: resolve(rootDir, 'destinatii.html'),
      },
    },
  },
})
