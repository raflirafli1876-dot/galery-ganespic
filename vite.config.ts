import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    tanstackStart(),
    tsconfigPaths(),
    tailwindcss(),
    viteReact(),
    nitro(),
  ],
  css: {
    minify: false,
  },
  build: {
    cssMinify: false,
  },
})