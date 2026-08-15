import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'   // <-- WAJIB!

export default defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),   // <-- HARUS ADA!
    viteReact(),
  ],
  css: {
    minify: false,   // Matiin minify biar gak kena LightningCSS
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    cssMinify: false,
  },
})
