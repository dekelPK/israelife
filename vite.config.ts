import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative so the build works whether it's served from a domain root
  // (GitHub Pages, a custom host) or nested under a path (the Artifact
  // preview used for phone testing).
  base: './',
  plugins: [react(), tailwindcss()],
})
