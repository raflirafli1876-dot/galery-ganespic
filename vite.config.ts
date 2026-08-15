import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  plugins: [
    tanstackStart(),
    viteReact(),
  ],
  css: {
    minify: false,  // <-- MATIKAN MINIFY BIAR GAK ERROR
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    cssMinify: false, // <-- TAMBAHIN INI JUGA BUAT PASTI
  },
})