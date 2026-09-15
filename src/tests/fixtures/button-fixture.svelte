<script lang="ts">
  import { Button, Field, Input } from '../../lib/index.js'
</script>

<Button>Save</Button>
<Field label="Email" hint="We never share it">
  {#snippet children(control)}
    <Input type="email" {...control} />
  {/snippet}
</Field>
