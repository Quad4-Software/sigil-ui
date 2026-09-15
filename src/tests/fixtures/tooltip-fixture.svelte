<script lang="ts">
  import { Button, Tooltip } from '../../lib/index.js'
</script>

<Tooltip text="Save changes">
  {#snippet children({ props })}
    <Button {...props}>Save</Button>
  {/snippet}
</Tooltip>
