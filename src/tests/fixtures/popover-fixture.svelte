<script lang="ts">
  import { Popover } from '../../lib/index.js'
</script>

<button data-testid="outside">outside</button>
<Popover.Root>
  <Popover.Trigger>Open popover</Popover.Trigger>
  <Popover.Content><button>inside</button></Popover.Content>
</Popover.Root>
