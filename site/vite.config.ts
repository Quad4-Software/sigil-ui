import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.SITE_BASE ?? '/sigil-ui/',
  plugins: [svelte()],
  build: {
    outDir: 'dist'
  }
})
