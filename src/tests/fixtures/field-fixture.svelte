<script lang="ts">
  import { Field, Input } from '../../lib/index.js'

  let { label, hint, error }: { label?: string; hint?: string; error?: string | undefined } =
    $props()
</script>

<Field {label} {hint} {error}>
  {#snippet children(props)}
    <Input {...props} />
  {/snippet}
</Field>
