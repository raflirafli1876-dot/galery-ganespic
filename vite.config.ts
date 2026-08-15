import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Tailwind v4 source() syntax tidak kompatibel dengan lightningcss minifier bawaan Vite 8.
  // Pakai esbuild untuk minify CSS sebagai gantinya.
  css: {
    transformer: "postcss",
  },
  build: {
    cssMinify: "esbuild",
  },
  plugins: [
    tanstackStart(), // harus sebelum react()
    viteReact(),
    tsConfigPaths(),
  ],
});
