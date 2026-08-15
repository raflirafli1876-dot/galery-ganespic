import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),
    viteReact(),
  ],
  css: { minify: false },
  resolve: { tsconfigPaths: true },
  build: { cssMinify: false },
  // ⬇️ INI YANG LO KURANG! ⬇️
  server: {
    preset: 'vercel'
  }
})