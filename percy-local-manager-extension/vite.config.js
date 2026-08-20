import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        library: resolve(__dirname, "library.html"),
        snapshots: resolve(__dirname, "snapshots.html"),
      },
    },
  },
});