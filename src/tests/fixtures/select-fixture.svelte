<script lang="ts">
  import { Select } from '../../lib/index.js'

  let value = $state('a')
</script>

<Select bind:value aria-label="Plan">
  <option value="a">A</option>
  <option value="b">B</option>
</Select>
<output data-testid="out">{value}</output>
