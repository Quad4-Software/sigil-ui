<script lang="ts">
  import { createTheme } from '../../lib/index.js'

  const theme = createTheme({ key: 'sig-test-theme' })
</script>

<button onclick={() => theme.toggle()}>{theme.resolved}</button>
