import { sigilPreset } from 'sigil-ui/uno'
import { defineConfig, type Preset } from 'unocss'
import presetAttributify from 'unocss/preset-attributify'
import presetWind4 from 'unocss/preset-wind4'

// sigilPreset is dependency-free data; cast it into unocss's Preset type
export default defineConfig({
  presets: [presetWind4(), presetAttributify(), sigilPreset as Preset]
})
