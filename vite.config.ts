/* File: vite.config.ts */
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  // publicDir defaults to "public" - just keep it.
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        rute: resolve(__dirname, "public/pages/rute.html"),
        destinatii: resolve(__dirname, "public/pages/destinatii.html"),
      },
    },
  },
});
