import { sigilPreset } from 'sigil-ui/panda'
import { defineConfig, type Preset } from '@pandacss/dev'

export default defineConfig({
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda', sigilPreset as Preset],
  include: ['./src/**/*.{svelte,ts}'],
  outdir: 'styled-system',
  importMap: 'styled-system',
  preflight: true
})
