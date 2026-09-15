import { svelte } from '@sveltejs/vite-plugin-svelte'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.SITE_BASE ?? '/sigil-ui/',
  plugins: [unocss(), svelte()],
  build: {
    outDir: 'dist'
  }
})
