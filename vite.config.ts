// vite.config.ts
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
  server: {
    preset: 'vercel' // <-- Ini penting buat deployment di Vercel
  },
  // ... konfigurasi lainnya
})